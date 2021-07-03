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
    private List<Week> weeks;
}
