package com.example.composite1.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;

@FeignClient(name="core-service")
public interface CoreClient {
    @GetMapping("/core/test/testGet")
    ResponseEntity<String> test();
}
