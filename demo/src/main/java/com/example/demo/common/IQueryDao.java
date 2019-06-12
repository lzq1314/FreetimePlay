package com.example.demo.common;

import org.apache.ibatis.session.SqlSessionFactory;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.List;
import java.util.Map;

public interface IQueryDao {
    List find(String sqlId, Map<String, Object> params) throws Exception;

    Object findOne(String sqlId, Map<String, Object> params) throws Exception;

    int insert(String sqlId, Map<String, Object> params) throws Exception, SQLException;

    int update(String sqlId, Map<String, Object> params) throws Exception, SQLException;

    int remove(String sqlId, Map<String, Object> params) throws Exception, SQLException;

    Connection getConnection() throws Exception, SQLException;

    Object getSession();

    SqlSessionFactory getSqlSessionFactory();
}
