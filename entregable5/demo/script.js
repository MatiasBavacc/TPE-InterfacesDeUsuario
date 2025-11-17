const pajaro = document.getElementById("pajaro");
const gameArea = document.body; 

let velocity;
let gravity = 0.5;
let jump = -8;
let gameOver;
let tuberiaSpawnInterval; 
const tuberias = []; 

// --- Configuración de Juego ---
const tuberiaSpeed = 7; 
const PAJARO_HEIGHT = 64; 
const PAJARO_WIDTH = 32;  
const TUBERIA_WIDTH = 64;
const TUBERIA_GAP = 400; 

// --- Configuración de Hitbox (Ajusta estos valores) ---
const PADDING_TOP = 60;    
const PADDING_BOTTOM = 60; 
const PADDING_SIDE = 40;   


// ==============================
// === FUNCIONES DE TUBERÍAS ====
// ==============================

function createTuberiaPair() {
    // 1. Calcular el punto de inicio del hueco (TOP del hueco)
    const minTop = 100;
    const maxTop = window.innerHeight - TUBERIA_GAP - 100;
    const gapStartTop = Math.floor(Math.random() * (maxTop - minTop + 1)) + minTop;

    // Posición X inicial (fuera de la pantalla)
    let xPos = window.innerWidth;
    
    // --- Tubería Superior ---
    const topTuberia = document.createElement("div");
    const topTuberiaHeight = gapStartTop; 
    
    topTuberia.classList.add("tuberia", "top");
    topTuberia.style.height = topTuberiaHeight + "px";
    topTuberia.style.left = xPos + "px";
    topTuberia.style.top = "0px"; 

    gameArea.appendChild(topTuberia);
    tuberias.push(topTuberia);

    // --- Tubería Inferior ---
    const bottomTuberia = document.createElement("div");
    const bottomTuberiaTop = gapStartTop + TUBERIA_GAP;
    const bottomTuberiaHeight = window.innerHeight - bottomTuberiaTop; 

    bottomTuberia.classList.add("tuberia", "bottom");
    bottomTuberia.style.height = bottomTuberiaHeight + "px";
    bottomTuberia.style.left = xPos + "px";
    bottomTuberia.style.top = bottomTuberiaTop + "px"; 

    gameArea.appendChild(bottomTuberia);
    tuberias.push(bottomTuberia);
}


function moverTuberias() {
    for (let i = 0; i < tuberias.length; i++) {
        const tuberia = tuberias[i];
        let x = parseFloat(tuberia.style.left);
        tuberia.style.left = (x - tuberiaSpeed) + "px";

        if (x + TUBERIA_WIDTH < 0) {
            tuberia.remove();
            tuberias.splice(i, 1);
            i--; 
        }
    }
}


function checkCollision() {
    const pajaroRect = pajaro.getBoundingClientRect(); 
    
    // --- DEFINICIÓN DE LA HITBOX REDUCIDA ---
    const pajaroHitbox = {
        top: pajaroRect.top + PADDING_TOP, 
        bottom: pajaroRect.bottom - PADDING_BOTTOM, 
        left: pajaroRect.left + PADDING_SIDE,
        right: pajaroRect.right - PADDING_SIDE,
    };
    // ----------------------------------------

    for (const tuberia of tuberias) {
        const tuberiaRect = tuberia.getBoundingClientRect(); 
        
        // Colisión en X: Usa la hitbox reducida (pajaroHitbox)
        const collisionX = pajaroHitbox.left < tuberiaRect.right && pajaroHitbox.right > tuberiaRect.left;

        // Colisión en Y: Usa la hitbox reducida (pajaroHitbox)
        const collisionY = pajaroHitbox.top < tuberiaRect.bottom && pajaroHitbox.bottom > tuberiaRect.top;

        if (collisionX && collisionY) {
            endGame();
            return true;
        }
    }
    return false;
}

// ==============================
// ===== FUNCIONES DE JUEGO =====
// ==============================

function resetGame() {
    // Detener la generación y eliminar tuberías
    clearInterval(tuberiaSpawnInterval); 
    tuberias.forEach(p => p.remove());
    tuberias.length = 0; 
    
    // Iniciar la generación de tuberías (cada 2 segundos)
    tuberiaSpawnInterval = setInterval(createTuberiaPair, 2000); 

    // Resetear variables y posición del pájaro
    velocity = 0;
    gameOver = false;
    pajaro.style.top = (window.innerHeight / 2) - 32 + "px";
    pajaro.style.transform = "scale(4) rotate(0deg)";

    // Iniciar loop
    update();
}

// Salto con tecla (Previene el desplazamiento con la barra espaciadora)
document.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
        e.preventDefault(); 
    }
    
    if (!gameOver && (e.code === "Space" || e.repeat === false)) {
        velocity = jump;
    }
});

function update() {
    if (gameOver) return;

    // 1. Mover tuberías y detectar colisión con ellas
    moverTuberias();
    if (checkCollision()) {
        return; 
    }

    // 2. Física del pájaro
    velocity += gravity;
    let y = parseFloat(getComputedStyle(pajaro).top);
    pajaro.style.top = (y + velocity) + "px";

    // 3. Rotación
    let tilt = velocity * 3;
    if (tilt > 60) tilt = 60;
    if (tilt < -30) tilt = -30;
    pajaro.style.transform = `scale(4) rotate(${tilt}deg)`;

    // 4. Colisión con suelo y techo (Usa la posición visual)
    const floor = window.innerHeight - (PAJARO_HEIGHT * 4); // El error en la multiplicación de la altura PAJARO_HEIGHT se mantiene

    if (y <= 0 || y >= floor) {
        return endGame();
    }
    
    requestAnimationFrame(update);
}

function endGame() {
    gameOver = true;
    
    // Detener la generación de tuberías al perder
    clearInterval(tuberiaSpawnInterval); 

    // Pausa para reiniciar
    setTimeout(() => {
        resetGame();
    }, 700);
}

// Iniciar todo
resetGame();