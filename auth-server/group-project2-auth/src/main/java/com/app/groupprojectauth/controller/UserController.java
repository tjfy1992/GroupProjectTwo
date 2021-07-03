package com.app.groupprojectauth.controller;

import com.app.groupprojectauth.domain.User;
import com.app.groupprojectauth.security.JwtUtil;
import com.app.groupprojectauth.service.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@CrossOrigin
@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private IUserService iUserService;

    private static final String jwtTokenCookieName = "JWT_TOKEN";
    private static final String signingKey = "signingKey";

    @PostMapping(value="/login")
    public Map<String, Object> login(@RequestParam Map<String, Object> params){
        if(params.get("username") == null){
            Map<String, Object> resultMap = new HashMap<>();
            resultMap.put("result", "failed");
            return resultMap;
        }
        Map<String, Object> map =  iUserService.userLogin(params);
        User user = (User) map.get("user");
        System.out.println(user);
        if(user != null){
            Map<String, Object> tokenObj = new HashMap<>();
            tokenObj.put("username", user.getUsername());
            tokenObj.put("id", user.getId());
            String token = JwtUtil.generateToken(signingKey, tokenObj.toString());
            map.put(jwtTokenCookieName, token);
        }
        return map;
    }

}
