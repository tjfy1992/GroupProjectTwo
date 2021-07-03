package com.example.core1.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/core/test")
public class TestController {
    @GetMapping("/testGet")
    public ResponseEntity<String> test(){
        return ResponseEntity.ok("user info");
    }
}
