// Funciones auxiliares de voz para los eventos onmouseover del HTML

function spkvoiceover() {
    if (typeof responsiveVoice !== 'undefined') {
        responsiveVoice.speak("Read captcha aloud", "US English Female", { rate: 0.75 });
    }
}

function spkrefresh() {
    if (typeof responsiveVoice !== 'undefined') {
        responsiveVoice.speak("Refresh captcha", "US English Female", { rate: 0.75 });
    }
}

function spksubmit() {
    if (typeof responsiveVoice !== 'undefined') {
        responsiveVoice.speak("Submit", "US English Female", { rate: 0.75 });
    }
}
