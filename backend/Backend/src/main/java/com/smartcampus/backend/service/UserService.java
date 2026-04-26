package com.smartcampus.backend.service;

import com.smartcampus.backend.model.User;
import com.smartcampus.backend.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.CopyOnWriteArrayList;

@Service
public class UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    private final UserRepository userRepository;
    private final List<User> fallbackUsers = new CopyOnWriteArrayList<>();
    private volatile boolean useFallbackStorage = false;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User registerUser(User user) {
        if (findUserByItNumber(user.getItNumber()).isPresent()) {
            throw new RuntimeException("An account with this IT Number already exists!");
        }

        return saveUser(user);
    }

    public User loginUser(String itNumber, String password) {
        User user = findUserByItNumber(itNumber)
                .orElseThrow(() -> new RuntimeException("Invalid IT Number or user not found."));
        
        if (!user.getPassword().equals(password)) {
            throw new RuntimeException("Invalid password. Please try again.");
        }
        
        // Exclude the password before returning for security
        user.setPassword(null);
        return user;
    }

    private Optional<User> findUserByItNumber(String itNumber) {
        if (useFallbackStorage) {
            return fallbackUsers.stream()
                    .filter(user -> itNumber.equals(user.getItNumber()))
                    .findFirst()
                    .map(this::copyUser);
        }

        try {
            return userRepository.findByItNumber(itNumber);
        } catch (RuntimeException ex) {
            enableFallback("find user by IT number", ex);
            return findUserByItNumber(itNumber);
        }
    }

    private User saveUser(User user) {
        if (useFallbackStorage) {
            return saveUserInFallback(user);
        }

        try {
            return userRepository.save(user);
        } catch (RuntimeException ex) {
            enableFallback("save user", ex);
            return saveUserInFallback(user);
        }
    }

    private User saveUserInFallback(User user) {
        User copy = copyUser(user);
        if (copy.getId() == null || copy.getId().isBlank()) {
            copy.setId(UUID.randomUUID().toString());
        }

        fallbackUsers.removeIf(existing -> copy.getItNumber().equals(existing.getItNumber()));
        fallbackUsers.add(copy);
        return copyUser(copy);
    }

    private User copyUser(User user) {
        User copy = new User();
        copy.setId(user.getId());
        copy.setName(user.getName());
        copy.setItNumber(user.getItNumber());
        copy.setPassword(user.getPassword());
        return copy;
    }

    private void enableFallback(String action, RuntimeException ex) {
        if (!useFallbackStorage) {
            logger.warn("Switching users to in-memory fallback because MongoDB failed during {}: {}", action, ex.getMessage());
            useFallbackStorage = true;
        }
    }
}
