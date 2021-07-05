package com.example.core1.service;

import com.example.core1.domain.User;

import java.util.Map;

public interface IUserService {
    Map<String, Object> getAllUsers();
    User getUserByUsername(String username);
    boolean updateTimeSheet(Map<String, Object> params);
}
