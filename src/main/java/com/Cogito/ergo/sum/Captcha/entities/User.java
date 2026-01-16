package com.Cogito.ergo.sum.Captcha.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "User")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idUser")
    private Integer idUser;

    @Column(name = "userId", nullable = false, unique = true)
    private String userId;

    @Column(name = "attempts", columnDefinition = "INT DEFAULT 0")
    private Integer attempts = 0;

    @Column(name = "bannedUntil")
    private Long bannedUntil;

}
