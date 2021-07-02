package com.app.groupprojectauth.domain;

import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class UserRowMapper implements RowMapper<User> {
    @Override
    public User mapRow(ResultSet resultSet, int i) throws SQLException {
        User user = new User();
        user.setId(resultSet.getInt("id"));
        user.setUsername(resultSet.getString("username"));
        user.setEmail(resultSet.getString("email"));
        user.setPersonId(resultSet.getInt("person_id"));
        user.setCreationDate(resultSet.getDate("create_date"));
        user.setRoleName(resultSet.getString("role"));
        user.setActivated(resultSet.getInt("activate") == 1);
        return user;
    }
}
