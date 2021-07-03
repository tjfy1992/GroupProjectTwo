package com.app.groupprojectauth.domain;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

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
}
