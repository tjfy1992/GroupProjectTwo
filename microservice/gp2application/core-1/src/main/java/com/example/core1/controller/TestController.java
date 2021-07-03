package com.example.core1.controller;

import com.example.core1.service.ITestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/core/test")
public class TestController {

    @Autowired
    private ITestService iTestService;

    @GetMapping("/testGet")
    public ResponseEntity<String> testGet(){
        return ResponseEntity.ok("user info");
    }

    @PostMapping("/testPost")
    public ResponseEntity<Map<String, Object>> testPost(@RequestParam Map<String, Object> params){
        System.out.println(params);
        Map<String, Object> resultMap = iTestService.test();
        return ResponseEntity.ok(resultMap);
    }
}
