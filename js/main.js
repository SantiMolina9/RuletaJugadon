const prizes = [
    { type: "lose", title: "¡SUERTE!", text: "GRACIAS POR PARTICIPAR", icon: "❌", val: "0" },
    { type: "merch", title: "¡FELICITACIONES!", text: "MERCH OFICIAL", icon: "👕", val: "M" },
    { type: "fs", title: "SENSATIONAL!", value: 30, text: "30 FREE SPINS", icon: "🎰", val: "30" },
    { type: "fs", title: "SENSATIONAL!", value: 50, text: "50 FREE SPINS", icon: "💎", val: "50" },
    { type: "fs", title: "SENSATIONAL!", value: 100, text: "100 FREE SPINS", icon: "🔥", val: "100" },
    { type: "fs", title: "MEGA WIN!", value: 200, text: "200 FREE SPINS", icon: "⭐", val: "200" },
    { type: "merch", title: "¡FELICITACIONES!", text: "MERCH OFICIAL", icon: "👕", val: "M" },
    { type: "lose", title: "¡SUERTE!", text: "GRACIAS POR PARTICIPAR", icon: "❌", val: "0" },
    { type: "fs", title: "SENSATIONAL!", value: 100, text: "100 FREE SPINS", icon: "🔥", val: "100" },
    { type: "fs", title: "SENSATIONAL!", value: 50, text: "50 FREE SPINS", icon: "💎", val: "50" },
    { type: "fs", title: "SENSATIONAL!", value: 30, text: "30 FREE SPINS", icon: "🎰", val: "30" },
    { type: "fs", title: "MEGA WIN!", value: 200, text: "200 FREE SPINS", icon: "⭐", val: "200" },
];

let rotation = 0;
const wheel = document.getElementById("wheel");
const slot = document.getElementById("slot");

const setupWheel = () => {
    const labelsContainer = document.getElementById("wheelLabels");
    if (!labelsContainer) return;

    const numPrizes = prizes.length;
    const sliceDeg = 360 / numPrizes; // Ahora son 60 grados exactos
    
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

    const numPrizes = prizes.length;
    const sliceDeg = 360 / numPrizes;
    const prizeIndex = Math.floor(Math.random() * numPrizes);
    const extraSpins = 5; 
    
    const centerOffset = sliceDeg / 2;
    // Cálculo para que el premio quede bajo la flecha superior (0 grados)
    const targetRotation = (360 - (prizeIndex * sliceDeg)) - centerOffset;
    
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

const resetGame = () => {
    rotation = 0;
    wheel.style.transform = "rotate(0deg)";
    slot.style.display = "none";
};

const init = () => {
    setupWheel();
    document.getElementById("btnSpin").addEventListener("click", spin);
    document.getElementById("btnReset").addEventListener("click", resetGame);
};

window.onload = init;

// Arrancamos la App
init(); 