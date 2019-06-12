package com.example.demo.test;

import com.example.demo.web.dao.QueryDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
//此注解把普通的pojo实例化到spring容器中，相当于配置文件中的<bean id="" class=""/>
@Component
public class test {
//此注解通过byType形式，用来指定的字段或方法注入所需的外部资源
    @Autowired
    private QueryDao qDao;

    public String testDemo(){
       return "返回结果";
    }

    public List<Map<String,Object>> jdbcTest(){
        QueryDao qq = new QueryDao();
        Map<String,Object> params = new HashMap<>();
       List<Map<String,Object>> ss=qDao.find("account.getUser",params);
        return  ss;
    }
    public static void main(String[] args) {
        test t = new test();
        List<Map<String, Object>> rtn = t.jdbcTest();
        for(Map r:rtn){
            System.out.println(r.get("host"));
        }
    }


}
