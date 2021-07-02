package com.app.groupprojectauth.service.impl;

import com.app.groupprojectauth.dao.IUserDao;
import com.app.groupprojectauth.domain.Token;
import com.app.groupprojectauth.domain.User;
import com.app.groupprojectauth.service.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class UserServiceImpl implements IUserService {

    @Autowired
    private IUserDao iUserDao;

    @Override
    public Map<String, Object> userLogin(Map<String, Object> param) {
        Map<String, Object> resultMap = new HashMap<>();
        User user = iUserDao.userLogin(param);
        if(user == null){
            resultMap.put("success", false);
        }
        else{
            Integer id = user.getId();
            Map<String, Object> statusMap = iUserDao.getApplicationStatus(id);
            resultMap.put("application_status", statusMap.get("application_status"));
            resultMap.put("success", true);
            resultMap.put("user", user);
        }
        return resultMap;
    }

    @Override
    public Map<String, Object> userRegister(Map<String, Object> param) {
        Map<String, Object> result = new HashMap<>();
        Map<String, Object> tokenResult = iUserDao.getToken(param);
        if(!(Boolean)tokenResult.get("success")){
            result.put("success", false);
            result.put("reason", tokenResult.get("reason"));
            return result;
        }
        else{
            Token token = (Token) tokenResult.get("token");
            long currentTime = System.currentTimeMillis();
            long expirationTime = token.getValidUntil().getTime();

            if(currentTime > expirationTime){
                result.put("success", false);
                result.put("reason", "token has expired");
                return result;
            }
            if(!token.getEmail().equals(param.get("email").toString())){
                result.put("success", false);
                result.put("reason", "Your email address doesn't fit the token");
                return result;
            }
        }
        result = iUserDao.userRegister(param);
        return result;
    }

}
