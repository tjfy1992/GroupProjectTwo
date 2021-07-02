package com.app.groupprojectauth.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Date;
import java.sql.Timestamp;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Token {
    Integer id;
    String content;
    Timestamp validUntil;
    String email;
    Integer creationEmployeeId;
}
