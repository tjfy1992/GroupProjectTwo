package com.example.composite1.controller;

import com.example.composite1.client.CoreClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/composite")
public class CompositeController {

    @Autowired
    CoreClient coreClient;

    @GetMapping("/testClient")
    public ResponseEntity<String> circuitDemo(){
        return coreClient.test();
    }
}
