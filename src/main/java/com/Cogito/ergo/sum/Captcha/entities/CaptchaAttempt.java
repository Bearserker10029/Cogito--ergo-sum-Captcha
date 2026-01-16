package com.Cogito.ergo.sum.Captcha.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "CaptchaAttempt")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CaptchaAttempt {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idAttempt;

    @ManyToOne
    @JoinColumn(name = "User_idUser", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "Captcha_idCaptcha", nullable = false)
    private Captcha captcha;

    @Column(nullable = false)
    private String userAnswer;

    @Column(nullable = false)
    private Boolean isCorrect;

    @Column(updatable = false)
    private LocalDateTime attemptedAt;

    @PrePersist
    protected void onCreate() {
        attemptedAt = LocalDateTime.now();
    }
}
