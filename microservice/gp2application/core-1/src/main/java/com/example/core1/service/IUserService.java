package com.example.core1.service;

import java.util.Map;

public interface IUserService {
    public Map<String, Object> userInfo(Map<String, Object> param);
    Map<String, Object> getAllUsers();
}
