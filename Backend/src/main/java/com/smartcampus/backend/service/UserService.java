package com.smartcampus.backend.service;

import com.smartcampus.backend.model.User;
import com.smartcampus.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User registerUser(User user) {
        Optional<User> existing = userRepository.findByItNumber(user.getItNumber());
        if (existing.isPresent()) {
            throw new RuntimeException("An account with this IT Number already exists!");
        }
        return userRepository.save(user);
    }

    public User loginUser(String itNumber, String password) {
        User user = userRepository.findByItNumber(itNumber)
                .orElseThrow(() -> new RuntimeException("Invalid IT Number or user not found."));
        
        if (!user.getPassword().equals(password)) {
            throw new RuntimeException("Invalid password. Please try again.");
        }
        
        // Exclude the password before returning for security
        user.setPassword(null);
        return user;
    }
}
