package com.example.demo.test;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

//lambda表达式的使用方式
public class lambdaTest {
    public static void lambdaMethod(){
        //lambda表达式单语句写法；将列表中的字符串转换成小写
        List<String> paramsString = Arrays.asList(new String[]{"Li","Zhi","Qiang"});
        List<String> stringName = paramsString.stream().map(name->{return name.toLowerCase();}).collect(Collectors.toList());//map表示接受一个表达式
        System.out.println(stringName.get(0)+stringName.get(1)+stringName.get(2)+"");

        //lambda表达式；方法引用写法
        List<String> stringName1 = paramsString.stream().map(String::toLowerCase).collect(Collectors.toList());//map表示接受一个表达式，String::toLowerCase表示string中toLowerCse方法
        System.out.println(stringName1.get(0)+stringName1.get(1)+stringName1.get(2)+"");

        //lambda表达式可使用的变量
        String waibu ="lambda";//外部变量
        List<String> stringName2 = paramsString.stream().map(chuandi->{
            Long zidyi = System.currentTimeMillis();//自定义变量
            String bianliangTest = waibu+chuandi+"-------:"+zidyi;
            return bianliangTest;
        }).collect(Collectors.toList());//map表示接受一个表达式
        stringName2.forEach(System.out::println);
    }
    public static void main(String[] args) {
        lambdaMethod();
    }
}
