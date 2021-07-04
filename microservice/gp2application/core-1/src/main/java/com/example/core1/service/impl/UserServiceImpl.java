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
    public Map<String, Object> getAllUsers() {
        Map<String, Object> resultMap = new HashMap<>();
        List<User> list = iUserRepo.findAll();
        resultMap.put("result", list);
        return resultMap;
    }
}
