package com.example.core1.dao;

import com.example.core1.domain.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface IUserRepo extends MongoRepository<User, String> {
    @Query(value="{ 'username' : ?0 }")
    List<User> userInfo(String username);
}
