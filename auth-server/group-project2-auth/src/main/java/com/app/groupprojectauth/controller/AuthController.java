package com.app.groupprojectauth.controller;

import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import io.jsonwebtoken.Jwts;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @PostMapping("/checkToken")
    public Map<String, Object> checkToken(@RequestBody Map<String, Object> params){
        Map<String, Object> resultMap = new HashMap<>();
        String token = params.get("token").toString();
        String str = Jwts.parser().setSigningKey("signingKey").parseClaimsJws(token).getBody().getSubject();
        System.out.println(str);
        if(str != null)
            resultMap.put("authenticated", "yes");
        else
            resultMap.put("authenticated", "no");
        return resultMap;
    }
}
