package com.Cogito.ergo.sum.Captcha.services;

import com.Cogito.ergo.sum.Captcha.entities.User;
import com.Cogito.ergo.sum.Captcha.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.concurrent.TimeUnit;

@Service
public class UserService {
    private final int MAX_ATTEMPTS = 3;
    private final long BAN_DURATION = TimeUnit.MINUTES.toMillis(1);

    @Autowired
    private UserRepository userRepository;

    public User getOrCreateUser(String userId) {
        return userRepository.findByUserId(userId)
                .orElseGet(() -> {
                    User newUser = new User();
                    newUser.setUserId(userId);
                    newUser.setAttempts(0);
                    return userRepository.save(newUser);
                });
    }

    public boolean isBanned(String userId) {
        User user = getOrCreateUser(userId);
        return user.getBannedUntil() != null && System.currentTimeMillis() < user.getBannedUntil();
    }

    public void banUser(String userId) {
        User user = getOrCreateUser(userId);
        user.setBannedUntil(System.currentTimeMillis() + BAN_DURATION);
        userRepository.save(user);
    }

    public int incrementAttempts(String userId) {
        User user = getOrCreateUser(userId);
        user.setAttempts(user.getAttempts() + 1);
        userRepository.save(user);
        return user.getAttempts();
    }

    public void resetAttempts(String userId) {
        User user = getOrCreateUser(userId);
        user.setAttempts(0);
        user.setBannedUntil(null);
        userRepository.save(user);
    }

    public int getMaxAttempts() {
        return MAX_ATTEMPTS;
    }
}
