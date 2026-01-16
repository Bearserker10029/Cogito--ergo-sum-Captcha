package com.Cogito.ergo.sum.Captcha.repositories;

import com.Cogito.ergo.sum.Captcha.entities.Image;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ImageRepository extends JpaRepository<Image, Integer> {
}
