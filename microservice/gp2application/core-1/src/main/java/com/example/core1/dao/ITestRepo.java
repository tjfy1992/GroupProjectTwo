package com.example.core1.dao;

import com.example.core1.domain.Test;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ITestRepo extends MongoRepository<Test, String> {
}
