const prizes = [
    { type: "lose", title: "¡SUERTE!", text: "GRACIAS POR PARTICIPAR", icon: "❌", val: "0" },
    { type: "merch", title: "¡FELICITACIONES!", text: "MERCH OFICIAL", icon: "👕", val: "M" },
    { type: "fs", title: "SENSATIONAL!", value: 30, text: "30 FREE SPINS", icon: "🎰", val: "30" },
    { type: "fs", title: "SENSATIONAL!", value: 50, text: "50 FREE SPINS", icon: "💎", val: "50" },
    { type: "fs", title: "SENSATIONAL!", value: 100, text: "100 FREE SPINS", icon: "🔥", val: "100" },
    { type: "merch", title: "¡FELICITACIONES!", text: "MERCH OFICIAL", icon: "👕", val: "M" },
    { type: "lose", title: "¡SUERTE!", text: "GRACIAS POR PARTICIPAR", icon: "❌", val: "0" },
    { type: "fs", title: "SENSATIONAL!", value: 100, text: "100 FREE SPINS", icon: "🔥", val: "100" },
    { type: "fs", title: "SENSATIONAL!", value: 50, text: "50 FREE SPINS", icon: "💎", val: "50" },
    { type: "fs", title: "SENSATIONAL!", value: 30, text: "30 FREE SPINS", icon: "🎰", val: "30" },
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
        const winSound = document.getElementById("winSound");
        if (winSound) winSound.play().catch(e => console.warn("Win sound blocked"));
        spawnParticles(); // ¡Ahora sí existe!
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