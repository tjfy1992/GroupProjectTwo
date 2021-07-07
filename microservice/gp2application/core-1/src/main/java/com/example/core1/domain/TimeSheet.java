package com.example.core1.domain;

import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class TimeSheet {
    private String year;
    private Integer totalFloatingDays;
    private Integer totalVacationDays;
    private List<Week> weeks;
    private Integer remainingFloatingDays;
    private Integer remainingVacationDays;
    private Integer Holidays;
}
