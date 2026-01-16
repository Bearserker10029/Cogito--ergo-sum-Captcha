package com.Cogito.ergo.sum.Captcha.repositories;

import com.Cogito.ergo.sum.Captcha.entities.CaptchaAttempt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CaptchaAttemptRepository extends JpaRepository<CaptchaAttempt, Integer> {
}
