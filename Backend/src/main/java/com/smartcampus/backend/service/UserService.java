package com.smartcampus.backend.service;

import com.smartcampus.backend.model.User;
import com.smartcampus.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public UserService(UserRepository userRepository, NotificationService notificationService) {
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }

    public User registerUser(User user) {
        Optional<User> existing = userRepository.findByItNumber(user.getItNumber());
        if (existing.isPresent()) {
            throw new RuntimeException("An account with this IT Number already exists!");
        }

        User saved = userRepository.save(user);

        // Create Welcome Notification
        notificationService.createStudentNotification(
                saved.getItNumber(),
                "SYSTEM",
                "Welcome to Smart Campus!",
                "Welcome " + saved.getName()
                        + "! Your account has been created successfully. You can now start booking campus resources.",
                null,
                "/create-booking");

        return saved;
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
