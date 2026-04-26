package com.smartcampus.backend.controller;

import com.smartcampus.backend.model.User;
import com.smartcampus.backend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }


// Booking Endpoints & validation

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody User user) {
        try {
            User registeredUser = userService.registerUser(user);
            return ResponseEntity.ok(registeredUser);
        } catch (RuntimeException e) {
            Map<String, String> body = new HashMap<>();
            body.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(body);
        }
    }



    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        try {
            String itNumber = credentials.get("itNumber");
            String password = credentials.get("password");
            User loggedInUser = userService.loginUser(itNumber, password);
            return ResponseEntity.ok(loggedInUser);   //Social Login Endpoint
        } catch (RuntimeException e) {
            Map<String, String> body = new HashMap<>(); //Get Email from Clerk
            body.put("error", e.getMessage());

            //Get Clerk ID
            return ResponseEntity.status(401).body(body); // 401 Unauthorized
        }
    }

     //Process Login
    
    @PostMapping("/social-login")
    public ResponseEntity<?> socialLogin(@RequestBody Map<String, String> data) {
        try {
            String email = data.get("email");
            String name = data.get("name");
            String clerkId = data.get("clerkId");
            User user = userService.processSocialLogin(email, name, clerkId);
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            Map<String, String> body = new HashMap<>();
            body.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(body);
        }
    }
}
