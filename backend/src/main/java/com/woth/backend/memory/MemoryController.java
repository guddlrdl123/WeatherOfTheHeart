package com.woth.backend.memory;

/**
 * 개인 메모(기억) 관리 REST API 컨트롤러입니다.
 * 사용자의 메모 목록 조회와 새 메모 생성 요청을 처리합니다.
 */
import com.woth.backend.global.dto.ApiResponse;
import org.springframework.http.MediaType;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping(path = "/api/users/{userId}/memories", produces = MediaType.APPLICATION_JSON_VALUE)
public class MemoryController {

    private final MemoryService memoryService;

    public MemoryController(MemoryService memoryService) {
        this.memoryService = memoryService;
    }

    @GetMapping
    @Transactional(readOnly = true)
    public ApiResponse<List<MemoryResponse>> list(@PathVariable Long userId) {
        List<MemoryResponse> memories = memoryService.listMemories(userId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
        return ApiResponse.success(memories);
    }

    @PostMapping
    public ApiResponse<MemoryResponse> create(@PathVariable Long userId, @RequestBody MemoryRequest request) {
        var memory = memoryService.createMemory(userId, new MemoryService.CreateMemoryRequest(
                request.memoryDate(),
                request.title(),
                request.content(),
                request.moodKey(),
                request.weatherKey(),
                request.objectKey(),
                request.slotKey()
        ));
        return ApiResponse.success(toResponse(memory));
    }

    private MemoryResponse toResponse(PrivateMemory memory) {
        return new MemoryResponse(
                memory.getId(),
                memory.getMemoryDate().toString(),
                memory.getTitle(),
                memory.getContent(),
                memory.getMoodKey(),
                memory.getWeatherKey(),
                memory.getObjectKey(),
                memory.getSlotKey(),
                memory.getCreatedAt().toString(),
                memory.getUpdatedAt().toString()
        );
    }

    public record MemoryRequest(
            String memoryDate,
            String title,
            String content,
            String moodKey,
            String weatherKey,
            String objectKey,
            String slotKey
    ) {
    }

    public record MemoryResponse(
            Long id,
            String memoryDate,
            String title,
            String content,
            String moodKey,
            String weatherKey,
            String objectKey,
            String slotKey,
            String createdAt,
            String updatedAt
    ) {
    }
}
