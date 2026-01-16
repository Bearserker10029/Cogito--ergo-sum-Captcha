// Funciones de estilo de fuente para el código captcha
function styleCaptcha() {
    const code = document.getElementById('code');
    if (!code || !code.textContent) return;

    const fonts = ['Arial', 'Verdana', 'Helvetica', 'Georgia', 'Times New Roman', 'Courier New'];
    const colors = ['#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6'];
    const codeText = code.textContent.split('');
    code.textContent = '';

    codeText.forEach(letter => {
        const span = document.createElement('span');
        span.textContent = letter;
        span.style.fontFamily = fonts[Math.floor(Math.random() * fonts.length)];
        span.style.color = colors[Math.floor(Math.random() * colors.length)];
        span.style.fontSize = '24px';
        span.style.fontWeight = 'bold';
        code.appendChild(span);
    });
}

// Aplicar estilos cuando se carga el DOM
document.addEventListener('DOMContentLoaded', function () {
    // Se llamará desde captcha-api.js después de cargar el captcha
    console.log('Code font module ready');
});