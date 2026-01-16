package com.Cogito.ergo.sum.Captcha.controllers;

import com.Cogito.ergo.sum.Captcha.services.CaptchaService;
import com.Cogito.ergo.sum.Captcha.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.util.Map;
import java.util.HashMap;

@Controller
public class CAPTCHAcontroller {

    @Autowired
    private UserService userService;

    @Autowired
    private CaptchaService captchaService;

    @GetMapping("/")
    public String index() {
        return "index";
    }

    @PostMapping("/captcha/validate")
    @ResponseBody
    public ResponseEntity<String> validateCaptcha(
            @RequestParam String userId,
            @RequestParam int captchaId,
            @RequestParam String answer) {

        try {
            if (userService.isBanned(userId)) {
                return ResponseEntity.status(403).body("User banned. Please try again later.");
            }

            boolean isValid = captchaService.validateCaptcha(captchaId, answer);

            if (!isValid) {
                int currentAttempts = userService.incrementAttempts(userId);
                captchaService.recordAttempt(userId, captchaId, answer, false);

                if (currentAttempts >= userService.getMaxAttempts()) {
                    userService.banUser(userId);
                    return ResponseEntity.status(403)
                            .body("Maximum attempts reached. User banned for 1 minute.");
                }
                return ResponseEntity.status(400)
                        .body("Invalid captcha. Remaining attempts: "
                                + (userService.getMaxAttempts() - currentAttempts));
            }

            captchaService.recordAttempt(userId, captchaId, answer, true);
            userService.resetAttempts(userId);
            return ResponseEntity.ok("Valid captcha.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500)
                    .body("Internal error: " + e.getMessage());
        }
    }

    @GetMapping("/captcha/getCaptcha")
    @ResponseBody
    public ResponseEntity<?> getCaptcha() {
        try {
            Map<String, Object> captcha = captchaService.getRandomCaptcha();

            if (captcha == null) {
                return ResponseEntity.status(404)
                        .body("No captchas available. Please contact the administrator.");
            }

            return ResponseEntity.ok(captcha);
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body("Internal error: " + e.getMessage());
        }
    }

    @GetMapping("/captcha/test")
    @ResponseBody
    public ResponseEntity<?> testCaptcha() {
        try {
            long totalCaptchas = captchaService.countAllCaptchas();
            long unusedCaptchas = captchaService.countUnusedCaptchas();

            Map<String, Object> diagnostics = new HashMap<>();
            diagnostics.put("totalCaptchas", totalCaptchas);
            diagnostics.put("unusedCaptchas", unusedCaptchas);
            diagnostics.put("status", "OK");

            return ResponseEntity.ok(diagnostics);
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body("Diagnostic error: " + e.getMessage());
        }
    }
}
