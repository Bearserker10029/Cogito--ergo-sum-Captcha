package com.Cogito.ergo.sum.Captcha.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "Image")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Image {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idImage;

    @Column(nullable = false)
    private String imageName;

    @Column(nullable = false, length = 500)
    private String imagePath;

    @Column(length = 500)
    private String question;

    @Lob
    private byte[] image;

}
