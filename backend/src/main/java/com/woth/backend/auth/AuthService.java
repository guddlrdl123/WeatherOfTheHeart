package com.woth.backend.auth;

/**
 * 인증 비즈니스 로직을 담당하는 서비스입니다.
 * 사용자 로그인 검증과 회원가입 시 중복 확인 및 사용자 저장을 처리합니다.
 */
import com.woth.backend.global.exception.CustomException;
import com.woth.backend.global.exception.ErrorCode;
import com.woth.backend.user.User;
import com.woth.backend.user.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private static final String ADMIN_EMAIL = "admin@maeum.weather";
    private static final String ADMIN_PASSWORD = "admin1234";

    private final UserRepository userRepository;

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional
    public User login(String email, String password) {
        // 개발용 관리자 계정도 DB 사용자로 보관해 프론트 mock이 아니라 백엔드 권한 값으로 판별합니다.
        if (ADMIN_EMAIL.equals(email) && ADMIN_PASSWORD.equals(password)) {
            return userRepository.findByEmail(email)
                    .map(user -> {
                        user.promoteToAdmin(password);
                        return user;
                    })
                    .orElseGet(() -> createAdminUser(email, password));
        }

        return userRepository.findByEmail(email)
                .filter(user -> user.getPassword().equals(password))
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
    }

    @Transactional
    public User signup(String email, String password, String nickname) {
        if (userRepository.existsByEmail(email)) {
            throw new CustomException(ErrorCode.USER_ALREADY_EXISTS);
        }

        User user = User.builder()
                .email(email)
                .password(password)
                .nickname(nickname)
                // 일반 회원가입 사용자는 관리자 권한 없이 생성됩니다.
                .isAdmin(false)
                .build();

        return userRepository.save(user);
    }

    private User createAdminUser(String email, String password) {
        User admin = User.builder()
                .email(email)
                .password(password)
                .nickname("Admin")
                .isAdmin(true)
                .build();

        return userRepository.save(admin);
    }
}
