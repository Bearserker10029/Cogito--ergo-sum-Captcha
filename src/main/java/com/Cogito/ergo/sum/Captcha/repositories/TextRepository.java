package com.Cogito.ergo.sum.Captcha.repositories;

import com.Cogito.ergo.sum.Captcha.entities.Text;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TextRepository extends JpaRepository<Text, Integer> {
}
