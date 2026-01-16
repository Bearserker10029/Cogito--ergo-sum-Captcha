package com.Cogito.ergo.sum.Captcha.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "Captcha")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Captcha {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idCaptcha;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "Text_idText")
    private Text text;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "Image_idImage")
    private Image image;

    @Column(nullable = false)
    private String answer;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CaptchaType captchaType;

    @Column(columnDefinition = "BOOLEAN DEFAULT FALSE")
    private Boolean isUsed = false;

    public enum CaptchaType {
        TEXT, IMAGE
    }
}
