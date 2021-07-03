package com.example.composite1.controller;

import com.example.composite1.client.CoreClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/composite")
public class CompositeController {

    @Autowired
    CoreClient coreClient;

    @GetMapping("/testClientGet")
    public ResponseEntity<String> getDemo(){
        return coreClient.test();
    }

    @PostMapping("/testClientPost")
    public ResponseEntity<Map<String, Object>> postDemo(@RequestParam Map<String, Object> params){
        return coreClient.testPost(params);
    }
}
