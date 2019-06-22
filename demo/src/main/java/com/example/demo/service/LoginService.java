package com.example.demo.service;

import com.example.demo.domain.User;
import com.example.demo.web.dao.QueryDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
@Service
public class LoginService {
    @Autowired
    private QueryDao qDao;

    public boolean verifyLogin (User user){
        boolean retBoolean = false;
        Map<String,Object> params = new HashMap<>();
        User userInfo=(User) qDao.findOne("user.getUser",params);
        if(userInfo != null){
            retBoolean = true;
        }
        return retBoolean;
    }
}
