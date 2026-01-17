INSERT INTO `captcha`.`Text` (`Text`) VALUES 
('ABC123'),
('XYZ789'),
('DEF456'),
('QWE321'),

INSERT INTO `captcha`.`Image` (`imageName`, `imagePath`, `question`) VALUES 
('copa-rostros.png', 'assets/captcha/copa-rostros.png', 'What do you see in the image?'),
('duck-rabbit.jpg', 'assets/captcha/duck-rabbit.jpg', 'What do you see in the image?'),
('Rorschach.png', 'assets/captcha/Rorschach.png', 'What do you see in this inkblot?'),
('emily dickinson.jpg', 'assets/captcha/emily dickinson.jpg', 'Who wrote this poem?'),
('3-metil-2-butanol.png', 'assets/captcha/3-metil-2-butanol.png', 'What is this chemical structure?');

INSERT INTO `captcha`.`Captcha` (`Text_idText`, `Image_idImage`, `Answer`, `captchaType`, `isUsed`) VALUES 
(1, NULL, 'ABC123', 'TEXT', FALSE),
(2, NULL, 'XYZ789', 'TEXT', FALSE),
(3, NULL, 'DEF456', 'TEXT', FALSE),
(4, NULL, 'QWE321', 'TEXT', FALSE),

INSERT INTO `captcha`.`Captcha` (`Text_idText`, `Image_idImage`, `Answer`, `captchaType`, `isUsed`) VALUES 
(NULL, 1, 'faces, cup, goblet, chalice', 'IMAGE', FALSE),
(NULL, 2, 'duck, rabbit, bird, bunny', 'IMAGE', FALSE),
(NULL, 3, 'butterfly, bat, moth, inkblot', 'IMAGE', FALSE),
(NULL, 4, 'emily dickinson, dickinson, poet', 'IMAGE', FALSE),
(NULL, 5, '3-metil-2-butanol, butanol, alcohol, molecule', 'IMAGE', FALSE);