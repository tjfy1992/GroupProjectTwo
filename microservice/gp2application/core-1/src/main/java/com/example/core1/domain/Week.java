package com.example.core1.domain;

import lombok.*;
import org.bson.BsonTimestamp;

import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class Week {
    private Date weekEnding;
    private Day Sunday;
    private Day Monday;
    private Day Tuesday;
    private Day Wednesday;
    private Day Thursday;
    private Day Friday;
    private Day Saturday;
    private String status;
}
