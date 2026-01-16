// Estado global del captcha
let currentCaptcha = null;
let userId = null;

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

// Cargar un nuevo captcha desde el servidor
async function loadCaptcha() {
    try {
        const response = await fetch('/captcha/getCaptcha');

        if (!response.ok) {
            const errorText = await response.text();
            swal("Error", errorText, "error");
            return;
        }

        currentCaptcha = await response.json();
        displayCaptcha(currentCaptcha);

        // Aplicar estilos al captcha si existe la función
        if (typeof styleCaptcha === 'function') {
            setTimeout(styleCaptcha, 50);
        }
    } catch (error) {
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
        codeElement.textContent = captcha.content;
        codeElement.style.display = 'block';

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

        // Mostrar la pregunta
        if (captcha.question) {
            codeElement.textContent = captcha.question;
            codeElement.style.display = 'block';
            codeElement.style.fontSize = '1.5rem';
            codeElement.style.color = '#037AE2';
            codeElement.style.fontFamily = 'Poppins, sans-serif';
            codeElement.style.fontWeight = 'bold';
            codeElement.style.letterSpacing = 'normal';
            codeElement.style.padding = '10px';
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
        imgElement.style.maxWidth = '100%';
        imgElement.style.maxHeight = '300px';
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
        swal("Error", "No captcha loaded. Please refresh the page.", "error");
        return;
    }

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
            swal("Success!", resultText, "success").then(() => {
                loadCaptcha(); // Cargar nuevo captcha
                document.getElementById('textbox').value = ''; // Limpiar input
            });
        } else if (response.status === 403) {
            // Usuario baneado
            swal("Banned!", resultText, "error");
            document.getElementById('textbox').value = '';
        } else if (response.status === 400) {
            // Respuesta incorrecta
            swal("Incorrect", resultText, "warning").then(() => {
                loadCaptcha(); // Cargar nuevo captcha
                document.getElementById('textbox').value = ''; // Limpiar input
            });
        } else {
            swal("Error", resultText, "error");
        }
    } catch (error) {
        swal("Error", "Could not validate captcha. Please try again.", "error");
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
            loadCaptcha();
        });
    }

    // Permitir submit con Enter
    const textbox = document.getElementById('textbox');
    if (textbox) {
        textbox.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                submitBtn.click();
            }
        });
    }
});
