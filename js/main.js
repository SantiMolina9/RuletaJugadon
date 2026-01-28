const prizes = [
    { type: "lose", title: "¡MALA SUERTE!", text: "GRACIAS POR PARTICIPAR", icon: "☹️", val: "0" },
    { type: "merch", title: "¡FELICITACIONES!", text: "GANASTE PREMIO JUGADON", icon: "🎁", val: "PREMIO" },
    { type: "fs", title: "FELICITACIONES!", value: 30, text: "GANASTE 30 FREE SPINS", icon: "🎉", val: "30" },
    { type: "fs", title: "FELICITACIONES!", value: 50, text: "GANASTE 50 FREE SPINS", icon: "🎉", val: "50" },
    { type: "fs", title: "FELICITACIONES!", value: 100, text: "GANASTE 100 FREE SPINS", icon: "🎉", val: "100" },
    { type: "merch", title: "¡FELICITACIONES!", text: "GANASTE PREMIO JUGADON!", icon: "🎁", val: "PREMIO" },
    { type: "lose", title: "¡MALA SUERTE!", text: "GRACIAS POR PARTICIPAR", icon: "☹️", val: "0" },
    { type: "fs", title: "FELICITACIONES!", value: 100, text: "GANASTE 100 FREE SPINS", icon: "🎉", val: "100" },
    { type: "fs", title: "FELICITACIONES!", value: 50, text: "GANASTE 50 FREE SPINS", icon: "🎉", val: "50" },
    { type: "fs", title: "FELICITACIONES!", value: 30, text: "GANASTE 30 FREE SPINS", icon: "🎉", val: "30" },
];

let rotation = 0;
let isSpinning = false;
const wheel = document.getElementById("wheel");
const slot = document.getElementById("slot");

const setupWheel = () => {
    const labelsContainer = document.getElementById("wheelLabels");
    if (!labelsContainer) return;

    const numPrizes = prizes.length;
    const sliceDeg = 360 / numPrizes;
    
    const colors = ["#1e4fa1", "#173b7a"];
    const gradientParts = prizes.map((_, i) => {
        const start = i * sliceDeg;
        const end = (i + 1) * sliceDeg;
        return `${colors[i % 2]} ${start}deg ${end}deg`;
    });
    
    wheel.style.background = `conic-gradient(${gradientParts.join(', ')})`;
    labelsContainer.innerHTML = "";

    prizes.forEach((prize, i) => {
        const label = document.createElement("div");
        label.className = "wheel-label";
        const rotationAngle = (i * sliceDeg) + (sliceDeg / 2);
        label.style.transform = `rotate(${rotationAngle}deg)`;
        label.innerHTML = `<i>${prize.icon}</i><strong>${prize.val}</strong>`;
        labelsContainer.appendChild(label);
    });
};

// Aseguramos que el foco esté en la ventana principal al cargar
window.focus();

window.addEventListener('keydown', function(event) {
    // Obtenemos el código de la tecla
    const key = event.key; // '1', '2', ..., 'Enter'
    const keyCode = event.keyCode; // 49-56 para números, 13 para Enter

    // Registramos en consola para debuggear en la TV si es necesario
    console.log("Tecla detectada: " + key + " (Code: " + keyCode + ")");

    // Lógica para teclas 1 a 8 o la tecla Enter
    if ((keyCode >= 49 && keyCode <= 56) || keyCode === 13) {
        
        // Evitamos que la tecla realice su función por defecto (como scroll)
        event.preventDefault();

        // Llamamos a la función de giro (asegúrate de que se llame así en tu main.js)
        if (typeof spin === "function") {
            spin();
        } else {
            console.error("La función spin() no está definida.");
        }
    }
});

// Forzar el foco si el usuario hace clic en cualquier parte del fondo
document.addEventListener('click', () => {
    window.focus();
});

// Opcional: Re-enfocar la ventana cada vez que se gane visibilidad
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        window.focus();
    }
});

const spin = () => {
    if (isSpinning) return;
    isSpinning = true;

    slot.style.display = "none";
    slot.classList.remove("win");

    // Manejo robusto de audio
    const spinSound = document.getElementById("spinSound");
    if (spinSound) spinSound.play().catch(e => console.warn("Audio blocked/not found"));

    const numPrizes = prizes.length;
    const sliceDeg = 360 / numPrizes;
    const prizeIndex = Math.floor(Math.random() * numPrizes);
    const extraSpins = 5; 
    
    const centerOffset = sliceDeg / 2;
    const targetRotation = (360 - (prizeIndex * sliceDeg)) - centerOffset;
    
    // Aplicamos la fórmula: $rotation_{new} = rotation_{total} + (offset_{target})$
    rotation += (extraSpins * 360) + targetRotation - (rotation % 360);
    
    wheel.style.transform = `rotate(${rotation}deg)`;

    setTimeout(() => {
        showResult(prizeIndex);
        isSpinning = false; // Se libera el bloqueo al finalizar la animación
    }, 4000);
};

const showResult = (index) => {
    const prize = prizes[index];
    document.getElementById("slotTitle").textContent = prize.title;
    document.getElementById("slotValue").textContent = prize.text;
    
    slot.style.display = "flex";
    slot.classList.add("win");

   if (prize.type !== "lose") {
        // Lógica de Ganador
        const winSound = document.getElementById("winSound");
        if (winSound) winSound.play().catch(e => console.warn("Win sound blocked"));
        spawnParticles(); 
    } else {
        // Lógica de Perdedor (NUEVA)
        const loseSound = document.getElementById("loseSound");
        if (loseSound) {
            loseSound.currentTime = 0; // Reinicia el audio por si se pulsa rápido
            loseSound.play().catch(e => console.warn("Lose sound blocked"));
        }
    }
};

// Función de partículas (restaurada)
const spawnParticles = () => {
    for (let i = 0; i < 30; i++) {
        const p = document.createElement("div");
        p.className = "particle";
        p.style.left = Math.random() * window.innerWidth + "px";
        p.style.backgroundColor = ["#f2c46d", "#ffffff", "#1e4fa1"][Math.floor(Math.random() * 3)];
        document.body.appendChild(p);
        setTimeout(() => p.remove(), 2000);
    }
};

const init = () => {
    setupWheel();
    
    window.addEventListener("keydown", (event) => {
        // Detectamos si es Enter o si es un número entre 1 y 8
        const isNumberKey = event.key >= "1" && event.key <= "8";
        
        if (event.key === "Enter" || isNumberKey) {
            spin();
        }
    });
};

init();