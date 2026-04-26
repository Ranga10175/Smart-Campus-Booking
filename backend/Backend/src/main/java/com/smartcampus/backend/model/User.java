package com.smartcampus.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "users")
public class User {
    @Id
    private String id;
    private String name;
    private String itNumber;
    private String password;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getItNumber() { return itNumber; }
    public void setItNumber(String itNumber) { this.itNumber = itNumber; }
    
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}
