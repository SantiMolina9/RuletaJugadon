// Configuración y Estado
const prizes = [
    { type: "lose", title: "¡SUERTE!", text: "GRACIAS POR PARTICIPAR", icon: "❌" },
    { type: "merch", title: "¡FELICITACIONES!", text: "MERCH OFICIAL", icon: "👕" },
    { type: "fs", title: "SENSATIONAL!", value: 30, text: "30 FREE SPINS", icon: "🎰" },
    { type: "fs", title: "SENSATIONAL!", value: 50, text: "50 FREE SPINS", icon: "💎" },
    { type: "fs", title: "SENSATIONAL!", value: 100, text: "100 FREE SPINS", icon: "🔥" }
];

let rotation = 0;
const sliceDeg = 360 / prizes.length;

// Selectores
const wheel = document.getElementById("wheel");
const iconsContainer = document.getElementById("wheelIcons");
const slot = document.getElementById("slot");

// Inicialización
const init = () => {
    setupWheel();
    document.getElementById("btnSpin").addEventListener("click", spin);
    document.getElementById("btnReset").addEventListener("click", resetGame);
};

const setupWheel = () => {
    const labelsContainer = document.getElementById("wheelLabels");
    const numPrizes = prizes.length;
    const anglePerPrize = 360 / numPrizes;

    // 1. Crear el fondo de colores dinámico
    const gradient = prizes.map((p, i) => 
        `${p.color} ${i * anglePerPrize}deg ${(i + 1) * anglePerPrize}deg`
    ).join(', ');
    wheel.style.background = `conic-gradient(${gradient})`;

    // 2. Crear los textos y números
    prizes.forEach((prize, i) => {
        const label = document.createElement("div");
        label.className = "wheel-label";
        
        // Rotamos cada etiqueta para que quede centrada en su gajo
        const rotation = (i * anglePerPrize) + (anglePerPrize / 2);
        label.style.transform = `rotate(${rotation}deg)`;

        label.innerHTML = `
            <span>${prize.icon}</span>
            <strong>${prize.val}</strong>
            <small>${prize.text}</small>
        `;
        labelsContainer.appendChild(label);
    });
};

const spin = () => {
    slot.style.display = "none";
    document.getElementById("spinSound").play();

    const prizeIndex = Math.floor(Math.random() * prizes.length);
    const extraSpins = 5;
    const targetRotation = (360 - (prizeIndex * sliceDeg));
    
    rotation += (extraSpins * 360) + targetRotation - (rotation % 360);
    
    wheel.style.transform = `rotate(${rotation}deg)`;
    iconsContainer.style.transform = `rotate(${rotation}deg)`;

    setTimeout(() => showResult(prizeIndex), 4000);
};

const showResult = (index) => {
    const prize = prizes[index];
    document.getElementById("slotTitle").textContent = prize.title;
    document.getElementById("slotValue").textContent = prize.text;
    
    slot.style.display = "flex";
    slot.classList.add("win");

    if (prize.type !== "lose") {
        document.getElementById("winSound").play();
        spawnParticles();
    }
};

const spawnParticles = () => {
    for (let i = 0; i < 30; i++) {
        const p = document.createElement("div");
        p.className = "particle";
        p.style.left = Math.random() * window.innerWidth + "px";
        document.body.appendChild(p);
        setTimeout(() => p.remove(), 1800);
    }
};

const resetGame = () => {
    rotation = 0;
    wheel.style.transform = "rotate(0deg)";
    iconsContainer.style.transform = "rotate(0deg)";
    slot.style.display = "none";
};

// Arrancamos la App
init();