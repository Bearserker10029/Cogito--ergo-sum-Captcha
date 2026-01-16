package com.Cogito.ergo.sum.Captcha.services;

import com.Cogito.ergo.sum.Captcha.entities.*;
import com.Cogito.ergo.sum.Captcha.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class CaptchaService {

    @Autowired
    private CaptchaRepository captchaRepository;

    @Autowired
    private CaptchaAttemptRepository captchaAttemptRepository;

    @Autowired
    private UserRepository userRepository;

    public Map<String, Object> getRandomCaptcha() {
        try {
            Optional<Captcha> captchaOpt = captchaRepository.findRandomUnusedCaptcha();

            if (captchaOpt.isEmpty()) {
                return null;
            }

            Captcha captcha = captchaOpt.get();
            Map<String, Object> response = new HashMap<>();
            response.put("captchaId", captcha.getIdCaptcha());
            response.put("type", captcha.getCaptchaType().toString());

            if (captcha.getCaptchaType() == Captcha.CaptchaType.TEXT) {
                if (captcha.getText() != null) {
                    response.put("content", captcha.getText().getText());
                } else {
                    throw new RuntimeException("El captcha TEXT no tiene texto asociado");
                }
            } else {
                if (captcha.getImage() != null) {
                    response.put("content", captcha.getImage().getImagePath());
                    response.put("imageName", captcha.getImage().getImageName());
                    response.put("question", captcha.getImage().getQuestion());
                } else {
                    throw new RuntimeException("El captcha IMAGE no tiene imagen asociada");
                }
            }

            return response;
        } catch (Exception e) {
            throw new RuntimeException("Error al obtener captcha: " + e.getMessage(), e);
        }
    }

    public boolean validateCaptcha(int captchaId, String answer) {
        Optional<Captcha> captchaOpt = captchaRepository.findById(captchaId);

        if (captchaOpt.isEmpty()) {
            return false;
        }

        Captcha captcha = captchaOpt.get();
        boolean isValid;

        // Para imágenes, verificar bidireccional contra múltiples respuestas
        if (captcha.getCaptchaType() == Captcha.CaptchaType.IMAGE) {
            String userAnswer = answer.trim().toLowerCase();
            String[] correctAnswers = captcha.getAnswer().toLowerCase().split(",");

            isValid = false;
            for (String correctAnswer : correctAnswers) {
                correctAnswer = correctAnswer.trim();
                if (userAnswer.contains(correctAnswer) || correctAnswer.contains(userAnswer)) {
                    isValid = true;
                    break;
                }
            }
        } else {
            // Para texto, mantener comparación exacta
            isValid = captcha.getAnswer().equalsIgnoreCase(answer.trim());
        }

        if (isValid) {
            captcha.setIsUsed(true);
            captchaRepository.save(captcha);
        }

        return isValid;
    }

    public void recordAttempt(String userId, int captchaId, String userAnswer, boolean isCorrect) {
        User user = userRepository.findByUserId(userId).orElse(null);
        Captcha captcha = captchaRepository.findById(captchaId).orElse(null);

        if (user != null && captcha != null) {
            CaptchaAttempt attempt = new CaptchaAttempt();
            attempt.setUser(user);
            attempt.setCaptcha(captcha);
            attempt.setUserAnswer(userAnswer);
            attempt.setIsCorrect(isCorrect);
            captchaAttemptRepository.save(attempt);
        }
    }

    public long countAllCaptchas() {
        return captchaRepository.count();
    }

    public long countUnusedCaptchas() {
        return captchaRepository.countByIsUsed(false);
    }
}
