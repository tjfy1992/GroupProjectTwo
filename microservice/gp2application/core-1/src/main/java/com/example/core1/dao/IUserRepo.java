package com.example.core1.dao;

import com.example.core1.domain.User;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface IUserRepo extends MongoRepository<User, String> {
}
