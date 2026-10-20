const statusText = document.getElementById('status');
const callBtn = document.getElementById('call-btn');
const core = document.getElementById('jarvis-core');
const bars = document.querySelectorAll('.bar');

let isCalling = false;

// Simple voice visualization logic
function animateCore(intensity) {
    const scale = 1 + (intensity * 0.2);
    core.style.transform = `scale(${scale})`;
}

function animateBars(intensity) {
    bars.forEach(bar => {
        const height = Math.random() * intensity * 30 + 10;
        bar.style.height = `${height}px`;
    });
}

// Handle call button
callBtn.addEventListener('click', () => {
    isCalling = !isCalling;

    if (isCalling) {
        callBtn.innerText = 'FINALIZAR LLAMADA';
        callBtn.style.background = 'rgba(255, 0, 0, 0.3)';
        statusText.innerText = 'SISTEMA: CONECTADO';
        statusText.style.color = '#ff4444';

        // Start visual simulation
        startVisuals();

        // Here we would call the backend API
        console.log("Requesting call to Jarvis backend...");
    } else {
        callBtn.innerText = 'INICIAR LLAMADA';
        callBtn.style.background = 'transparent';
        statusText.innerText = 'SISTEMA: EN ESPERA';
        statusText.style.color = '#00f2ff';
        stopVisuals();
    }
});

let visualInterval;
function startVisuals() {
    visualInterval = setInterval(() => {
        const intensity = Math.random();
        animateCore(intensity);
        animateBars(intensity);
    }, 150);
}

function stopVisuals() {
    clearInterval(visualInterval);
    animateCore(0);
    bars.forEach(bar => bar.style.height = '10px');
}

// Web Speech API - Basic Integration
if ('webkitSpeechRecognition' in window) {
    const recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'es-ES';

    recognition.onresult = (event) => {
        if (!isCalling) return;
        const transcript = event.results[event.results.length - 1][0].transcript;
        console.log("User said: " + transcript);

        // Send transcript to backend
        fetch('https://subside-impulse-showman.ngrok-free.dev/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: transcript })
        }).then(res => res.json()).then(data => {
            console.log("Jarvis response:", data.response);
            // Use SpeechSynthesis to speak the response
            const utterance = new SpeechSynthesisUtterance(data.response);
            utterance.lang = 'es-ES';
            window.speechSynthesis.speak(utterance);
        });
    };

    callBtn.addEventListener('click', () => {
        if (isCalling) recognition.start();
        else recognition.stop();
    });
}
