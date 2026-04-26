package com.smartcampus.backend.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "users")
public class User {
    @Id
    private String id;

    @NotBlank(message = "Name is required")
    @Size(min = 2, message = "Name must be at least 2 characters long")
    private String name;

    @NotBlank(message = "IT Number is required")
    @Pattern(regexp = "^IT\\d+$", message = "Invalid IT Number format (e.g. IT21000000)")
    private String itNumber;

    @Pattern(regexp = "^[A-Za-z0-9+_.-]+@(.+)$", message = "Invalid email format")
    private String email;

    private String clerkId;

    @NotBlank(message = "Password is required")
    @Size(min = 4, max = 6, message = "Password must be between 4 and 6 characters")
    private String password;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getItNumber() { return itNumber; }
    public void setItNumber(String itNumber) { this.itNumber = itNumber; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getClerkId() { return clerkId; }
    public void setClerkId(String clerkId) { this.clerkId = clerkId; }
    
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}
