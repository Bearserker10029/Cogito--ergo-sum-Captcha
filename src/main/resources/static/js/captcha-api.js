// Estado global del captcha
let currentCaptcha = null;
let userId = null;
let timerInterval = null;
let timerSeconds = 60; // Tiempo límite en segundos

// Generar o recuperar userId del localStorage
function getUserId() {
    if (!userId) {
        userId = localStorage.getItem('captchaUserId');
        if (!userId) {
            userId = 'user_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
            localStorage.setItem('captchaUserId', userId);
        }
    }
    return userId;
}

// Función para hablar texto usando responsiveVoice (si está disponible)
function speak(text, rate = 0.75) {
    if (typeof responsiveVoice !== 'undefined') {
        responsiveVoice.setDefaultVoice("US English Female");
        responsiveVoice.setDefaultRate(rate);
        responsiveVoice.speak(text);
    }
}

// Función para iniciar el temporizador de cuenta regresiva
function startTimer() {
    clearInterval(timerInterval);
    let seconds = timerSeconds;

    timerInterval = setInterval(() => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        const formattedTime = `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

        // Actualizar UI del temporizador si existe
        const timerElement = document.getElementById('timerDisplay');
        if (timerElement) {
            timerElement.textContent = formattedTime;
            timerElement.style.color = seconds <= 10 ? 'red' : 'rgb(21, 204, 61)';
        }

        if (seconds <= 0) {
            clearInterval(timerInterval);
            handleTimeout();
        }

        seconds--;
    }, 1000);
}

// Función para detener el temporizador
function stopTimer() {
    clearInterval(timerInterval);
}

// Manejar cuando se acaba el tiempo
function handleTimeout() {
    const input = document.getElementById('textbox');
    const userResponse = input ? input.value.trim() : '';

    if (!userResponse) {
        speak("Time is up. You did not enter the CAPTCHA in time. Please try again.");
        swal({
            title: "TIME'S UP!",
            text: "You did not enter the CAPTCHA in time. Please try again!",
            icon: "warning",
            button: "Retry",
        }).then(() => {
            loadCaptcha();
        });
    }
}

// Función para leer el captcha en voz alta
function readCaptcha() {
    if (!currentCaptcha) {
        speak("No captcha loaded");
        return;
    }

    if (currentCaptcha.type === 'TEXT') {
        let text = "";
        const content = currentCaptcha.content || '';
        for (let i = 0; i < content.length; i++) {
            text += content.charAt(i) + " ";
        }
        speak(text + ". Please repeat the captcha", 0.6);
    } else if (currentCaptcha.type === 'IMAGE') {
        const question = currentCaptcha.question || 'What do you see in the image?';
        speak(question);
    }
}

// Cargar un nuevo captcha desde el servidor
async function loadCaptcha() {
    try {
        // Detener temporizador anterior
        stopTimer();

        const response = await fetch('/captcha/getCaptcha');

        if (!response.ok) {
            const errorText = await response.text();
            speak("Error loading captcha");
            swal("Error", errorText, "error");
            return;
        }

        currentCaptcha = await response.json();
        displayCaptcha(currentCaptcha);

        // Limpiar input
        const input = document.getElementById('textbox');
        if (input) {
            input.value = '';
            input.focus();
        }

        // Iniciar nuevo temporizador (desactivado)
        // startTimer();

        // Aplicar estilos al captcha SOLO si es de tipo TEXT
        if (currentCaptcha.type === 'TEXT' && typeof styleCaptcha === 'function') {
            setTimeout(styleCaptcha, 50);
        }
    } catch (error) {
        speak("Error loading captcha");
        swal("Error", "Could not load captcha. Please try again.", "error");
    }
}

// Mostrar el captcha en la interfaz
function displayCaptcha(captcha) {
    console.log('Displaying captcha:', captcha);
    const codeElement = document.getElementById('code');
    const captchaContainer = document.getElementById('textCaptcha');
    const headerElement = captchaContainer.querySelector('.header');

    if (captcha.type === 'TEXT') {
        // Mostrar captcha de texto
        headerElement.innerHTML = '<b>CAPTCHA</b>';
        // Limpiar atributos de pregunta
        codeElement.removeAttribute('data-type');
        codeElement.innerHTML = '';
        codeElement.textContent = captcha.content;
        codeElement.style.display = 'block';
        codeElement.style.fontSize = '';
        codeElement.style.color = '';
        codeElement.style.fontFamily = '';
        codeElement.style.textAlign = '';

        // Mostrar la imagen de fondo del captcha
        const bgImage = captchaContainer.querySelector('.captchabg');
        if (bgImage) {
            bgImage.style.display = 'block';
        }

        // Restaurar estilos originales de los iconos
        const icons = captchaContainer.querySelector('.icons');
        if (icons) {
            icons.style.backgroundColor = '';
            icons.style.padding = '';
            icons.style.borderRadius = '';
            icons.style.marginTop = '';
        }

        // Ocultar imagen si existe
        const imgElement = captchaContainer.querySelector('.securityCode img.captcha-image');
        if (imgElement) {
            imgElement.style.display = 'none';
        }
    } else if (captcha.type === 'IMAGE') {
        // Mostrar captcha de imagen
        console.log('Processing IMAGE captcha');
        headerElement.innerHTML = '<b>CAPTCHA</b>';

        // Mostrar la pregunta con estilo uniforme
        if (captcha.question) {
            // Limpiar cualquier span de estilos anteriores
            codeElement.innerHTML = '';
            codeElement.textContent = captcha.question;
            codeElement.style.display = 'block';
            codeElement.style.fontSize = '1.5rem';
            codeElement.style.color = '#333333';
            codeElement.style.fontFamily = 'Poppins, sans-serif';
            codeElement.style.fontWeight = 'bold';
            codeElement.style.letterSpacing = 'normal';
            codeElement.style.padding = '10px';
            codeElement.style.textAlign = 'center';
            // Marcar que es una pregunta para evitar estilos multicolor
            codeElement.setAttribute('data-type', 'question');
        } else {
            codeElement.style.display = 'none';
        }

        // Ocultar la imagen de fondo del captcha
        const bgImage = captchaContainer.querySelector('.captchabg');
        if (bgImage) {
            bgImage.style.display = 'none';
        }

        // Asegurar que los iconos sean visibles
        const icons = captchaContainer.querySelector('.icons');
        if (icons) {
            icons.style.position = 'relative';
            icons.style.zIndex = '20';
            icons.style.backgroundColor = 'rgba(3, 122, 226, 0.8)';
            icons.style.padding = '10px';
            icons.style.borderRadius = '10px';
            icons.style.marginTop = '10px';
        }

        // Buscar o crear elemento de imagen
        let imgElement = captchaContainer.querySelector('.securityCode img.captcha-image');
        if (!imgElement) {
            console.log('Creating new image element');
            imgElement = document.createElement('img');
            imgElement.className = 'captcha-image';
            const securityCodeDiv = captchaContainer.querySelector('.securityCode');
            securityCodeDiv.insertBefore(imgElement, codeElement);
        }

        // Asegurar que la ruta comience con /
        const imagePath = captcha.content.startsWith('/') ? captcha.content : '/' + captcha.content;
        console.log('Setting image src to:', imagePath);
        imgElement.src = imagePath;
        imgElement.alt = 'Captcha Image';
        imgElement.style.display = 'block';
        imgElement.style.maxWidth = '60%';
        imgElement.style.maxHeight = '200px';
        imgElement.style.objectFit = 'contain';
        imgElement.style.position = 'relative';
        imgElement.style.zIndex = '10';
        imgElement.style.margin = '20px auto';
        console.log('Image element:', imgElement);
    }
}

// Validar el captcha con el servidor
async function validateCaptcha(answer) {
    if (!currentCaptcha) {
        speak("No captcha loaded");
        swal("Error", "No captcha loaded. Please refresh the page.", "error");
        return;
    }

    if (!answer || answer.trim() === '') {
        speak("Please enter the CAPTCHA");
        swal({
            title: "CAPTCHA NOT FOUND!",
            text: "Please enter the text!",
            icon: "warning",
            button: "Retry",
        });
        return;
    }

    // Detener temporizador durante validación
    stopTimer();

    try {
        const response = await fetch('/captcha/validate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                userId: getUserId(),
                captchaId: currentCaptcha.captchaId,
                answer: answer
            })
        });

        const resultText = await response.text();

        if (response.ok) {
            // Validación exitosa
            speak("Valid CAPTCHA");
            swal({
                title: "VALID CAPTCHA!",
                text: resultText + " Do you want to proceed?",
                icon: "success",
                buttons: true,
            }).then((willProceed) => {
                if (willProceed) {
                    // Aquí puedes redirigir a otra página
                    // window.location.href = "login.html";
                    speak("Proceeding to next page");
                }
                loadCaptcha();
            });
        } else if (response.status === 403) {
            // Usuario baneado
            speak("User banned. Please try again later.");
            swal("Banned!", resultText, "error");
            document.getElementById('textbox').value = '';
        } else if (response.status === 400) {
            // Respuesta incorrecta
            speak("Invalid CAPTCHA");
            swal({
                title: "CAPTCHA INVALID!",
                text: resultText,
                icon: "error",
                button: "Retry",
            }).then(() => {
                loadCaptcha();
            });
        } else {
            speak("Error validating captcha");
            swal("Error", resultText, "error").then(() => {
                loadCaptcha();
            });
        }
    } catch (error) {
        speak("Error validating captcha");
        swal("Error", "Could not validate captcha. Please try again.", "error").then(() => {
            loadCaptcha();
        });
    }
}

// Inicializar eventos cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function () {
    // Cargar captcha inicial
    loadCaptcha();

    // Evento del botón de submit
    const submitBtn = document.getElementById('submitTextBtn');
    if (submitBtn) {
        submitBtn.addEventListener('click', function (e) {
            e.preventDefault();
            const answer = document.getElementById('textbox').value.trim();

            if (!answer) {
                swal("Warning", "Please enter your answer", "warning");
                return;
            }

            validateCaptcha(answer);
        });
    }

    // Evento del botón de refresh/cambiar
    const changeBtn = document.getElementById('changeTextBtn');
    if (changeBtn) {
        changeBtn.addEventListener('click', function (e) {
            e.preventDefault();
            speak("Refreshing captcha");
            loadCaptcha();
        });
    }

    // Evento del botón de leer captcha (si existe)
    const readBtn = document.getElementById('readText');
    if (readBtn) {
        readBtn.addEventListener('click', function (e) {
            e.preventDefault();
            readCaptcha();
        });
    }

    // Permitir submit con Enter
    const textbox = document.getElementById('textbox');
    if (textbox) {
        textbox.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                const answer = textbox.value.trim();
                validateCaptcha(answer);
            }
        });
    }

    // Inicializar reconocimiento de voz si está disponible
    initSpeechRecognition();
});

// Función para inicializar reconocimiento de voz
function initSpeechRecognition() {
    const startBtn = document.getElementById('start-btn');
    if (!startBtn) return;

    // Verificar si el navegador soporta reconocimiento de voz
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        console.log('Speech recognition not supported');
        return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.lang = 'en-US';

    recognition.onstart = function () {
        const instructions = document.getElementById('instructions');
        if (instructions) {
            instructions.textContent = "Voice recognition is on";
        }
        speak("Voice recognition is on");
    };

    recognition.onspeechend = function () {
        const instructions = document.getElementById('instructions');
        if (instructions) {
            instructions.textContent = "No activity";
        }
    };

    recognition.onerror = function () {
        const instructions = document.getElementById('instructions');
        if (instructions) {
            instructions.textContent = "Try Again";
        }
    };

    recognition.onresult = function (event) {
        const current = event.resultIndex;
        const transcript = event.results[current][0].transcript;
        const textbox = document.getElementById('textbox');

        if (textbox) {
            textbox.value = transcript.toLowerCase();
        }
    };

    startBtn.addEventListener('click', function () {
        recognition.start();
    });
}
