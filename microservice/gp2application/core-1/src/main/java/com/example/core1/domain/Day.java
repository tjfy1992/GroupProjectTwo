package com.example.core1.domain;

import lombok.*;
import org.bson.BsonTimestamp;

import java.sql.Timestamp;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class Day {
    private BsonTimestamp startingTime;
    private BsonTimestamp endingTime;
    private boolean isFloatingDay;
    private boolean isHoliday;
    private boolean isVacation;
}
