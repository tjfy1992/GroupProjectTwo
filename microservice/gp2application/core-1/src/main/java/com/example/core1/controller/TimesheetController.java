package com.example.core1.controller;

import com.example.core1.domain.TimeSheet;
import com.example.core1.domain.User;
import com.example.core1.domain.Week;
import com.example.core1.service.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

@RestController
@RequestMapping("/core/timesheet")
public class TimesheetController {

    private static final DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");

    @Autowired
    private IUserService iUserService;

    @GetMapping("/timesheetList")
    public Map<String, Object> getTimesheet(@RequestParam Map<String, Object> params) throws ParseException {
        Map<String, Object> resultMap = new HashMap<>();
        User user = iUserService.getUserByUsername(params.get("username").toString());
        String year = params.get("year").toString();
        List<TimeSheet> timeSheetList = user.getTimeSheets();
        TimeSheet timeSheet = timeSheetList.stream()
                .filter(item -> item.getYear().equals(year)).findFirst().orElse(null);
        List<Week> weeks = timeSheet.getWeeks();
        long milliseconds = dateFormat.parse("2021-07-03").getTime();
        Week week = weeks.stream()
                .filter(item -> item.getWeekEnding().getTime() == milliseconds)
                .findFirst().orElse(null);
        resultMap.put("username", user.getUsername());
        resultMap.put("week", week);
        return resultMap;
    }

    @PostMapping("/updateTimesheet")
    public Map<String, Object> updateTimesheet(@RequestParam Map<String, Object> params) {
        //System.out.println(params);
        //System.out.println(params.get("endDate"));
        Map<String, Object> resultMap = new HashMap<>();
        boolean result = iUserService.updateTimeSheet(params);
        resultMap.put("result", result);
        return resultMap;
    }

    @PostMapping("/addTimesheet")
    public Map<String, Object> addTimesheet(@RequestParam Map<String, Object> params) {
        //System.out.println(params);
        //System.out.println(params.get("endDate"));
        Map<String, Object> resultMap = new HashMap<>();
        boolean result = iUserService.addTimesheet(params);
        resultMap.put("result", result);
        return resultMap;
    }

    @GetMapping("/getWeek")
    public Map<String, Object> getWeek(@RequestParam Map<String, Object> params) {
        Map<String, Object> resultMap = new HashMap<>();
        Week week = iUserService.getWeek(params);
        resultMap.put("week", week);
        return resultMap;
    }

}
