package com.woth.backend.memory;

/**
 * 개인 메모 도메인 로직을 수행하는 서비스입니다.
 * 사용자의 개인 방 생성, 메모 중복 검사, 메모 저장을 담당합니다.
 */
import com.woth.backend.global.exception.CustomException;
import com.woth.backend.global.exception.ErrorCode;
import com.woth.backend.room.PrivateRoom;
import com.woth.backend.room.PrivateRoomRepository;
import com.woth.backend.user.User;
import com.woth.backend.user.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class MemoryService {

    private final UserRepository userRepository;
    private final PrivateRoomRepository privateRoomRepository;
    private final PrivateMemoryRepository privateMemoryRepository;

    public MemoryService(
            UserRepository userRepository,
            PrivateRoomRepository privateRoomRepository,
            PrivateMemoryRepository privateMemoryRepository
    ) {
        this.userRepository = userRepository;
        this.privateRoomRepository = privateRoomRepository;
        this.privateMemoryRepository = privateMemoryRepository;
    }

    @Transactional(readOnly = true)
    public List<PrivateMemory> listMemories(Long userId) {
        return privateMemoryRepository.findByPrivateRoomUserId(userId);
    }

    @Transactional
    public PrivateMemory createMemory(Long userId, CreateMemoryRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        LocalDate memoryDate = LocalDate.parse(request.memoryDate());

        if (privateMemoryRepository.existsByPrivateRoomUserIdAndMemoryDate(userId, memoryDate)) {
            throw new CustomException(ErrorCode.MEMORY_DUPLICATE);
        }

        int year = memoryDate.getYear();
        int month = memoryDate.getMonthValue();

        PrivateRoom privateRoom = privateRoomRepository.findByUserIdAndYearAndMonth(userId, year, month)
                .orElseGet(() -> privateRoomRepository.save(
                        PrivateRoom.builder()
                                .user(user)
                                .year(year)
                                .month(month)
                                .title("나만의 방")
                                .build()
                ));

        PrivateMemory memory = PrivateMemory.builder()
                .privateRoom(privateRoom)
                .title(request.title())
                .content(request.content())
                .moodKey(request.moodKey())
                .weatherKey(request.weatherKey())
                .objectKey(request.objectKey())
                .slotKey(request.slotKey())
                .memoryDate(memoryDate)
                .build();

        return privateMemoryRepository.save(memory);
    }

    public record CreateMemoryRequest(
            String memoryDate,
            String title,
            String content,
            String moodKey,
            String weatherKey,
            String objectKey,
            String slotKey
    ) {
    }
}
