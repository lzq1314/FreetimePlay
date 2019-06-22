package com.example.demo.controller;

import com.example.demo.config.WebSecurityConfig;
import com.example.demo.domain.User;
import com.example.demo.service.LoginService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.SessionAttribute;

import javax.jws.WebParam;
import javax.servlet.http.HttpSession;

@Controller
public class LoginController {
    @Autowired
    private LoginService loginService;
    @GetMapping("/")
    public String index(@SessionAttribute(WebSecurityConfig.SESSION_KEY)String account, Model model){
        return "/index";
    }

    @GetMapping("/login")
    public String login(){
        return "login";
    }

    @PostMapping("/loginVerify")
    public String loginVerify(String username,String password,HttpSession session){
       User user = new User();
        user.setUsername(username);
        user.setPassword(password);
        boolean verify = loginService.verifyLogin(user);
        System.out.println("++++++++++++++++"+verify);
        if(true){
            session.setAttribute(WebSecurityConfig.SESSION_KEY,"lizhiqiang");
            return "/index";
        }else {
            return "redirect:/login";
        }
    }

    @GetMapping("/logout")
    public String logout(HttpSession session){
        session.removeAttribute(WebSecurityConfig.SESSION_KEY);
        return "redirect:/login";
    }
}
