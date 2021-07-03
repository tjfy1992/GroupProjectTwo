package com.example.composite1.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.HashMap;
import java.util.Map;

@FeignClient(name="core-service")
public interface CoreClient {
    @GetMapping("/core/test/testGet")
    ResponseEntity<String> test();

    @PostMapping("/core/test/testPost")
    ResponseEntity<Map<String, Object>> testPost(@RequestParam Map<String, Object> params);
}
