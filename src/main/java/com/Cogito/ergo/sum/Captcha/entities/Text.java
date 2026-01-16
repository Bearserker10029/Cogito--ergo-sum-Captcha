package com.Cogito.ergo.sum.Captcha.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "Text")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Text {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idText;

    @Column(nullable = false)
    private String text;

}
