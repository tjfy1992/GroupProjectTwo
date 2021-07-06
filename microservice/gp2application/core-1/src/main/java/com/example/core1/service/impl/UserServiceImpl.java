package com.example.core1.service.impl;

import com.example.core1.dao.IUserRepo;
import com.example.core1.domain.User;
import com.example.core1.service.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class UserServiceImpl implements IUserService {

    @Autowired
    private IUserRepo iUserRepo;

    @Override
    public Map<String, Object> userInfo(Map<String, Object> param) {
        Map<String, Object> resultMap = new HashMap<>();
        String username = param.get("username").toString();
        List<User> list = iUserRepo.userInfo(username);
        if(list.isEmpty()){
            resultMap.put("result", "failed");
            return resultMap;
        }
        User user = list.get(0);
        resultMap.put("result", "successful");
        resultMap.put("user", user);
        return resultMap;
    }

    @Override
    public Map<String, Object> getAllUsers() {
        Map<String, Object> resultMap = new HashMap<>();
        List<User> list = iUserRepo.findAll();
        resultMap.put("result", list);
        return resultMap;
    }

    @Override
    public User getUserByUsername(String username) {
        List<User> users = iUserRepo.getUserTimesheetByUsername(username);
        if(users.isEmpty())
            return null;
        return users.get(0);
    }

    @Override
    public boolean updateTimeSheet(Map<String, Object> params) {
        return false;
    }
}
