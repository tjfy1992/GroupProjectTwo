package com.example.core1.domain;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
@Document("user")
public class User {
    @Id
    private String id;
    private String username;
    private String password;
    private String phone;
    private String email;
    private String address;
    private List<EmergencyContact> emergencyContacts;
    private List<TimeSheet> timeSheets;
}
