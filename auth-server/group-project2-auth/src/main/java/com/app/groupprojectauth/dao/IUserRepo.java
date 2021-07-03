package com.app.groupprojectauth.dao;

import com.app.groupprojectauth.domain.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface IUserRepo extends MongoRepository<User, String> {
    @Query(value="{ 'username' : ?0, 'password': ?1 }", fields="{ 'username' : 1}")
    List<User> userLogin(String username, String password);
}
