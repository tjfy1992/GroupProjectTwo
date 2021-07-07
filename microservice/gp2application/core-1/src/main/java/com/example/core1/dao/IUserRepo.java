package com.example.core1.dao;

import com.example.core1.domain.User;
import com.example.core1.domain.Week;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface IUserRepo extends MongoRepository<User, String> {
    @Query(value="{ 'username' : ?0 }")
    List<User> userInfo(String username);

    @Query(value="{ 'username' : ?0 }", fields="{ 'timeSheets' : 1, 'username' : 2}")
    List<User> getUserTimesheetByUsername(String username);

    @Query(value="{ 'username' : ?0 }", fields="{ 'template' : 1}")
    List<Week> getUserTemplate(String username);

}
