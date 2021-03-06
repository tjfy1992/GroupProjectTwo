package com.example.core1.service;

import com.example.core1.domain.User;
import com.example.core1.domain.Week;

import java.util.Map;

public interface IUserService {
    Map<String, Object> userInfo(Map<String, Object> param);
    Map<String, Object> getAllUsers();
    User getUserByUsername(String username);
    boolean updateTimeSheet(Map<String, Object> params);
    boolean addTimesheet(Map<String, Object> params);
    boolean updateProfile(Map<String, String> params);
    Week getWeek(Map<String, Object> params);
    Week buildTemplate(Map<String, Object> params);
    boolean updateTemplate(Map<String, Object> params);
    Week getTemplateByUsername(String username);
}
