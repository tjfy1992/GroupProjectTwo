package com.example.gateway.config;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.Map;

@FeignClient(name = "AuthFeign", url = "http://localhost:9999")
public interface AuthClient {
    @PostMapping("/auth/checkToken")
    Map<String, Object> checkToken(@RequestParam Map<String, Object> params);
}
