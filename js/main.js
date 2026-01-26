// Configuración y Estado
const prizes = [
    { type: "lose", title: "¡SUERTE!", text: "GRACIAS POR PARTICIPAR", icon: "❌", val: "0" },
    { type: "merch", title: "¡FELICITACIONES!", text: "MERCH OFICIAL", icon: "👕", val: "M" },
    { type: "fs", title: "SENSATIONAL!", value: 30, text: "30 FREE SPINS", icon: "🎰", val: "30" },
    { type: "fs", title: "SENSATIONAL!", value: 50, text: "50 FREE SPINS", icon: "💎", val: "50" },
    { type: "fs", title: "SENSATIONAL!", value: 100, text: "100 FREE SPINS", icon: "🔥", val: "100" }
];

let rotation = 0;
const sliceDeg = 360 / prizes.length;

const wheel = document.getElementById("wheel");
const slot = document.getElementById("slot");

const setupWheel = () => {
    const labelsContainer = document.getElementById("wheelLabels");
    if (!labelsContainer) return;

    const anglePerPrize = 360 / prizes.length;
    
    // Fondo dinámico con tus colores
    const colors = ["#1e4fa1", "#173b7a"];
    const gradient = prizes.map((_, i) => 
        `${colors[i % 2]} ${i * anglePerPrize}deg ${(i + 1) * anglePerPrize}deg`
    ).join(', ');
    
    wheel.style.background = `conic-gradient(${gradient})`;
    labelsContainer.innerHTML = "";

    prizes.forEach((prize, i) => {
        const label = document.createElement("div");
        label.className = "wheel-label";
        const rotationAngle = (i * anglePerPrize) + (anglePerPrize / 2);
        label.style.transform = `rotate(${rotationAngle}deg)`;

        label.innerHTML = `
            <i>${prize.icon}</i>
            <strong>${prize.val}</strong>
        `;
        labelsContainer.appendChild(label);
    });
};

const spin = () => {
    slot.style.display = "none";
    slot.classList.remove("win");
    document.getElementById("spinSound").play();

    const prizeIndex = Math.floor(Math.random() * prizes.length);
    const extraSpins = 5;
    const targetRotation = (360 - (prizeIndex * sliceDeg));
    
    // Sumamos la rotación acumulada para que siempre gire hacia adelante
    rotation += (extraSpins * 360) + targetRotation - (rotation % 360);
    
    wheel.style.transform = `rotate(${rotation}deg)`;

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

window.onload = setupWheel;

const init = () => {
    setupWheel();
    document.getElementById("btnSpin").addEventListener("click", spin);
    document.getElementById("btnReset").addEventListener("click", resetGame);
};

// Arrancamos la App
init(); 