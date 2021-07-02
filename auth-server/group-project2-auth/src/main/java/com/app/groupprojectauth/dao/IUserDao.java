package com.app.groupprojectauth.dao;

import com.app.groupprojectauth.domain.User;

import java.util.Map;

public interface IUserDao {
    User userLogin(Map<String, Object> param);
    Map<String, Object> userRegister(Map<String, Object> param);
    Map<String, Object> getToken(Map<String, Object> param);
    Map<String, Object> getApplicationStatus(Integer user_id);
}
