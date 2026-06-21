package com.emotionapp.backend.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CleanupPreviewResponse {
    private long paymentsToDelete;
    private int daysThreshold;
}
