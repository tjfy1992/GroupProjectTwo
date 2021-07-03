package com.app.groupprojectauth.service.impl;

import com.app.groupprojectauth.dao.IUserRepo;
import com.app.groupprojectauth.domain.User;
import com.app.groupprojectauth.service.IUserService;
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
    public Map<String, Object> userLogin(Map<String, Object> param) {
        Map<String, Object> resultMap = new HashMap<>();
        String username = param.get("username").toString();
        String password = param.get("password").toString();
        List<User> list = iUserRepo.userLogin(username, password);
        if(list.isEmpty()){
            resultMap.put("result", "failed");
            return resultMap;
        }
        User user = list.get(0);
        resultMap.put("result", "successful");
        resultMap.put("user", user);
        return resultMap;
    }

}
