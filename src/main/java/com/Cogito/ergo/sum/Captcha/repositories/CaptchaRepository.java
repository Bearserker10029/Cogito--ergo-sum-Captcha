package com.Cogito.ergo.sum.Captcha.repositories;

import com.Cogito.ergo.sum.Captcha.entities.Captcha;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface CaptchaRepository extends JpaRepository<Captcha, Integer> {
    @Query(value = "SELECT * FROM Captcha WHERE isUsed = false ORDER BY RAND() LIMIT 1", nativeQuery = true)
    Optional<Captcha> findRandomUnusedCaptcha();

    long countByIsUsed(Boolean isUsed);
}
