package com.woth.backend.mailbox;

/**
 * 우편함 도메인 비즈니스 로직을 담당하는 서비스입니다.
 * 편지 목록 조회, 읽음 상태 업데이트 등의 데이터를 처리합니다.
 */
import com.woth.backend.global.exception.CustomException;
import com.woth.backend.global.exception.ErrorCode;
import com.woth.backend.user.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class MailboxService {

    private final LetterRepository letterRepository;
    private final UserRepository userRepository;

    public MailboxService(LetterRepository letterRepository, UserRepository userRepository) {
        this.letterRepository = letterRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<Letter> listLetters(Long receiverId) {
        if (!userRepository.existsById(receiverId)) {
            throw new CustomException(ErrorCode.USER_NOT_FOUND);
        }
        return letterRepository.findByReceiverIdOrderByCreatedAtDesc(receiverId);
    }

    @Transactional
    public Letter markRead(Long letterId) {
        Letter letter = letterRepository.findById(letterId)
                .orElseThrow(() -> new CustomException(ErrorCode.MAILBOX_NOT_FOUND));
        if (!letter.getIsRead()) {
            letter = Letter.builder()
                    .id(letter.getId())
                    .sender(letter.getSender())
                    .receiver(letter.getReceiver())
                    .title(letter.getTitle())
                    .message(letter.getMessage())
                    .plazaTitle(letter.getPlazaTitle())
                    .completedAt(letter.getCompletedAt())
                    .isRead(true)
                    .createdAt(letter.getCreatedAt())
                    .updatedAt(letter.getUpdatedAt())
                    .build();
            return letterRepository.save(letter);
        }
        return letter;
    }
}
