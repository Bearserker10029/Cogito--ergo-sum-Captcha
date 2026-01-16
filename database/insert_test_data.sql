INSERT INTO `captcha`.`Text` (`Text`) VALUES 
('ABC123'),
('XYZ789'),
('DEF456'),
('QWE321'),
('RTY654');

INSERT INTO `captcha`.`Image` (`imageName`, `imagePath`, `question`) VALUES 
('copa-rostros.png', 'assets/captcha/copa-rostros.png', 'What do you see in the image?');

INSERT INTO `captcha`.`Captcha` (`Text_idText`, `Image_idImage`, `Answer`, `captchaType`, `isUsed`) VALUES 
(1, NULL, 'ABC123', 'TEXT', FALSE),
(2, NULL, 'XYZ789', 'TEXT', FALSE),
(3, NULL, 'DEF456', 'TEXT', FALSE),
(4, NULL, 'QWE321', 'TEXT', FALSE),
(5, NULL, 'RTY654', 'TEXT', FALSE);

INSERT INTO `captcha`.`Captcha` (`Text_idText`, `Image_idImage`, `Answer`, `captchaType`, `isUsed`) VALUES 
(NULL, 1, 'faces, cup', 'IMAGE', FALSE);


