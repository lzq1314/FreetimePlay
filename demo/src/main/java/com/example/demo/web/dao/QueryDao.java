package com.example.demo.web.dao;

import com.example.demo.common.IQueryDao;
import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Component;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.List;
import java.util.Map;


@Component
public class QueryDao implements IQueryDao {
	@Autowired
	private SqlSessionTemplate session;
	
	public List find(String sqlId, Map<String,Object> params) throws DataAccessException {
		return session.selectList(sqlId, params);
	}

	
	public Object findOne(String sqlId, Map<String,Object> params) throws DataAccessException {
		return session.selectOne(sqlId, params);
	}

	
	public int insert(String sqlId, Map<String,Object> params) throws DataAccessException,
			SQLException {
		return session.insert(sqlId, params);
	}

	
	public int update(String sqlId, Map<String,Object> params) throws DataAccessException,
			SQLException {
		return session.update(sqlId, params);
	}

	
	public int remove(String sqlId, Map<String,Object> params) throws DataAccessException,
			SQLException {
		return session.delete(sqlId, params);
	}
	
	public int execute(String sqlId, Map<String,Object> params) throws DataAccessException,
		SQLException {
		return session.update(sqlId, params);
	}


	@Override
	public Connection getConnection() throws Exception, SQLException {
		// TODO Auto-generated method stub
		return null;
	}


	@Override
	public Object getSession() {
		// TODO Auto-generated method stub
		return null;
	}


	@Override
	public SqlSessionFactory getSqlSessionFactory() {
		// TODO Auto-generated method stub
		return null;
	}
}
