-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema captcha
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema captcha
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `captcha` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `captcha` ;

-- -----------------------------------------------------
-- Table `captcha`.`User`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `captcha`.`User` (
  `idUser` INT NOT NULL AUTO_INCREMENT,
  `userId` VARCHAR(255) NOT NULL UNIQUE,
  `attempts` INT DEFAULT 0,
  `bannedUntil` BIGINT NULL,
  PRIMARY KEY (`idUser`),
  INDEX `idx_userId` (`userId` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `captcha`.`Text`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `captcha`.`Text` (
  `idText` INT NOT NULL AUTO_INCREMENT,
  `Text` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`idText`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `captcha`.`Image`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `captcha`.`Image` (
  `idImage` INT NOT NULL AUTO_INCREMENT,
  `imageName` VARCHAR(255) NOT NULL,
  `imagePath` VARCHAR(500) NOT NULL,
  `question` VARCHAR(500) NULL,
  `Image` LONGBLOB NULL,
  PRIMARY KEY (`idImage`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `captcha`.`Captcha`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `captcha`.`Captcha` (
  `idCaptcha` INT NOT NULL AUTO_INCREMENT,
  `Text_idText` INT NULL,
  `Image_idImage` INT NULL,
  `Answer` VARCHAR(255) NOT NULL,
  `captchaType` ENUM('TEXT', 'IMAGE') NOT NULL,
  `isUsed` BOOLEAN DEFAULT FALSE,
  PRIMARY KEY (`idCaptcha`),
  INDEX `fk_Captcha_Text_idx` (`Text_idText` ASC),
  INDEX `fk_Captcha_Image1_idx` (`Image_idImage` ASC),
  CONSTRAINT `fk_Captcha_Text`
    FOREIGN KEY (`Text_idText`)
    REFERENCES `captcha`.`Text` (`idText`)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  CONSTRAINT `fk_Captcha_Image1`
    FOREIGN KEY (`Image_idImage`)
    REFERENCES `captcha`.`Image` (`idImage`)
    ON DELETE SET NULL
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `captcha`.`CaptchaAttempt`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `captcha`.`CaptchaAttempt` (
  `idAttempt` INT NOT NULL AUTO_INCREMENT,
  `User_idUser` INT NOT NULL,
  `Captcha_idCaptcha` INT NOT NULL,
  `userAnswer` VARCHAR(255) NOT NULL,
  `isCorrect` BOOLEAN NOT NULL,
  `attemptedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`idAttempt`),
  INDEX `fk_Attempt_User_idx` (`User_idUser` ASC),
  INDEX `fk_Attempt_Captcha_idx` (`Captcha_idCaptcha` ASC),
  CONSTRAINT `fk_Attempt_User`
    FOREIGN KEY (`User_idUser`)
    REFERENCES `captcha`.`User` (`idUser`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_Attempt_Captcha`
    FOREIGN KEY (`Captcha_idCaptcha`)
    REFERENCES `captcha`.`Captcha` (`idCaptcha`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
