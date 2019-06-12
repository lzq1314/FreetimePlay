package com.example.demo;

import com.example.demo.test.test;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.List;
import java.util.Map;

//测试
@RunWith(SpringRunner.class)
@SpringBootTest
public class DemoApplicationTests {
    @Autowired
    test t;
    @Test
    public void contextLoads() {
        List<Map<String, Object>> rtn = t.jdbcTest();
        for(Map r:rtn){
            System.out.println(r.get("host"));
        }
    }
}
