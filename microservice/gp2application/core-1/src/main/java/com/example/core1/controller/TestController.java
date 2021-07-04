package com.example.core1.controller;

import com.example.core1.dao.TimeSheetRepo;
import com.example.core1.domain.TimeSheetForSummary;
import com.example.core1.service.ITestService;
import com.example.core1.service.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/core/test")
public class TestController {

    @Autowired
    private TimeSheetRepo timesheetRepo;

    @Autowired
    private ITestService iTestService;

    @Autowired
    private IUserService iUserService;

    @GetMapping("/summary")
    public ResponseEntity<List<TimeSheetForSummary>> getListOfTimesheet(@RequestParam Map<String, String> username) {
//        List<TimeSheetForSummary> list = timesheetRepo.findAllByUserName(username);
        String uname = username.get("userName");
        List<TimeSheetForSummary> list = new ArrayList<>();
        TimeSheetForSummary ts = new TimeSheetForSummary(1,"Zack","3/21/2018",30,"Completed","Approved",0,1,3);
        TimeSheetForSummary ts2 = new TimeSheetForSummary(2,"Zack","4/21/2018",31,"Incomplete","Not approved",3,1,1);
        TimeSheetForSummary ts3 = new TimeSheetForSummary(3,"Zack","5/21/2018",23,"Not Started","N/A",0,0,0);
        list.add(ts);
        list.add(ts2);
        list.add(ts3);
        if (list == null) {
            System.out.println("empty list");
        }
        System.out.println(list.toString());
        return ResponseEntity.ok(list);
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
}
