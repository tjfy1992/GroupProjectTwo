package com.example.core1.domain;
import lombok.*;
//import org.springframework.data.annotation.Id;
//import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString

public class TimeSheetForSummary {
    private Integer id;
    private String userName;
    private String weekEnding;
    private Integer totalHours;
    private String submissionStatus;
    private String approvalStatus;
    private Integer usedfloatingday;
    private Integer holiday;
    private Integer usedvacationday;

}
