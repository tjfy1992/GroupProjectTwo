package com.example.core1.dao;


import com.example.core1.domain.TimeSheet;
import com.example.core1.domain.TimeSheetForSummary;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface TimeSheetRepo extends MongoRepository<TimeSheet, String> {
    List<TimeSheet> findAllByUserName(String username);
//    TimeSheetForSummary findByUserIdAndWeekEnding(Integer userId, String weekEnding);
}