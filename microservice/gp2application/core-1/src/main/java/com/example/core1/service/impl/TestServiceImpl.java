package com.example.core1.service.impl;

import com.example.core1.dao.ITestRepo;
import com.example.core1.domain.Test;
import com.example.core1.service.ITestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class TestServiceImpl implements ITestService {

    @Autowired
    private ITestRepo iTestRepo;

    @Override
    public Map<String, Object> test() {
        List<Test> resultList = iTestRepo.findAll();
        Map<String, Object> result = new HashMap<>();
        result.put("result", resultList);
        return result;
    }
}
