package com.example.core1.controller;

import com.example.core1.dao.TimeSheetRepo;

import com.example.core1.domain.*;

import com.example.core1.file.AmazonS3FileService;
import com.example.core1.service.ITestService;
import com.example.core1.service.IUserService;
import org.bson.BsonTimestamp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.multipart.MultipartResolver;
import org.springframework.web.multipart.commons.CommonsMultipartResolver;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/core/test")
public class TestController {

//    @Autowired
//    private TimeSheetRepo timesheetRepo;

    @Autowired
    private ITestService iTestService;

    @Autowired
    private IUserService iUserService;

    @Autowired
    private AmazonS3FileService amazonS3FileService;


    @GetMapping("/getuserinfo")
    public ResponseEntity<Map<String, Object>> getUserInfo(@RequestParam Map<String, Object> params) {
        if(params.get("username") == null){
            Map<String, Object> resultMap = new HashMap<>();
            resultMap.put("result", "failed");
            return ResponseEntity.ok(resultMap);
        }
        Map<String, Object> map =  iUserService.userInfo(params);
        User user = (User) map.get("user");
        System.out.println(user);
        return ResponseEntity.ok(map);
    }

    @GetMapping("/getTemplate")
    public ResponseEntity<Map<String, Object>> getTemplate(@RequestParam Map<String, Object> params) {
        if(params.get("username") == null){
            Map<String, Object> resultMap = new HashMap<>();
            resultMap.put("result", "false");
            return ResponseEntity.ok(resultMap);
        }
        Map<String, Object> map =  new HashMap<>();
        map.put("result","true");
        map.put("template",iUserService.getTemplateByUsername(params.get("username").toString()));
        return ResponseEntity.ok(map);
    }

    @PostMapping("/updateTemplate")
    public ResponseEntity<Map<String, Object>> udpateTemplate(@RequestParam Map<String, Object> params) {
        if(params.get("username") == null){
            Map<String, Object> resultMap = new HashMap<>();
            resultMap.put("result", "fail");
            return ResponseEntity.ok(resultMap);
        }
        Map<String, Object> map =  new HashMap<>();
        map.put("result","success");
        iUserService.updateTemplate(params);
        return ResponseEntity.ok(map);
    }


    /*@GetMapping("/profile")
    public ResponseEntity<User> getUserProfile(@RequestParam Map<String, String> username) {
        String uname = username.get("userName");
        List<TimeSheet> timeSheetList = new ArrayList<>();
        List<EmergencyContact> emergencyContactList = new ArrayList<>();
        EmergencyContact ec1 = new EmergencyContact("Daniel", "Lee", "2223334456");
        EmergencyContact ec2 = new EmergencyContact("Joseph", "Parker", "1112223355");
        emergencyContactList.add(ec1);
        emergencyContactList.add(ec2);
        User user = new User("60dfe7706d29da8cbbdb82f6", "Zack", "123456", "1234567890", "zack@beaconfire.com", "200 Sayre Drive, Princeton, New Jersey, 08648", emergencyContactList, timeSheetList);
        if (user == null) {
            System.out.println("No profile available");
        }
        System.out.println(user.toString());
        return ResponseEntity.ok(user);
    }*/

    @PostMapping(value="/updateprofile")
    public Map<String, Object> updateUserProfile(@RequestParam Map<String, String> params){
        Map<String, Object> resultMap = new HashMap<>();
        iUserService.updateProfile(params);
        return resultMap;
    }

    @GetMapping("/testGet")
    public ResponseEntity<String> testGet(){
        return ResponseEntity.ok("user info");
    }

    @PostMapping("/testPost")
    public ResponseEntity<Map<String, Object>> testPost(@RequestParam Map<String, Object> params){
        System.out.println(params);
        Map<String, Object> resultMap = iUserService.getAllUsers();
        return ResponseEntity.ok(resultMap);
    }

    @GetMapping("/s3")
    public Map<String, Object> testS3(){
        amazonS3FileService.printOutName();
        return new HashMap<String, Object>();
    }

    @PostMapping("/fileUploadWithForm")
    public Map<String, Object> testFileUploadWithForm(@RequestPart("file") MultipartFile file,
            @RequestParam Map<String, Object> paramMap){

        Map<String, Object> resultMap = new HashMap<>();
        return resultMap;
    }
}
