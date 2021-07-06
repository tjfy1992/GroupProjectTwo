package com.example.core1.service.impl;

import com.example.core1.dao.IUserRepo;
import com.example.core1.domain.TimeSheet;
import com.example.core1.domain.User;
import com.example.core1.domain.Week;
import com.example.core1.service.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class UserServiceImpl implements IUserService {

    @Autowired
    private IUserRepo iUserRepo;

    @Override
    public Map<String, Object> getAllUsers() {
        Map<String, Object> resultMap = new HashMap<>();
        List<User> list = iUserRepo.findAll();
        resultMap.put("result", list);
        return resultMap;
    }

    @Override
    public User getUserByUsername(String username) {
        List<User> users = iUserRepo.getUserTimesheetByUsername(username);
        if(users.isEmpty())
            return null;
        return users.get(0);
    }

    @Override
    public boolean updateTimeSheet(Map<String, Object> params) {
        return false;
    }

    @Override
    public boolean addTimesheet(Map<String, Object> params) {
//        List<TimeSheet> timeSheetList = user.getTimeSheets();
//        TimeSheet timeSheet = timeSheetList.stream()
//                .filter(item -> item.getYear().equals(year)).findFirst().orElse(null);
//        List<Week> weeks = timeSheet.getWeeks();
//        long milliseconds = dateFormat.parse("2021-07-03").getTime();
//        Week week = weeks.stream()
//                .filter(item -> item.getWeekEnding().getTime() == milliseconds)
//                .findFirst().orElse(null);

        System.out.println(params);
        System.out.println(params.get("Saturday"));
        return false;
    }
}
