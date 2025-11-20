// flappy-game.js (versión con comentarios y constantes en español)
"use strict";

/* ------------------------- ELEMENTOS ------------------------- */
const bird = document.getElementById("bird"); // el pájaro
const gameContainer = document.getElementById("game-container"); // contenedor del juego
const gameArea = document.getElementById("flappy-bird-game"); // área de juego

/* ------------------------- VARIABLES ------------------------- */
let paused = false;       // pausado
let velocity = 0;         // velocidad vertical
const gravity = 0.3;      // gravedad
const jump = -8;          // impulso del salto

export let gameOver = false; // fin del juego
let score = 0;               // puntaje
let scoreInterval = null;    // intervalo que suma puntos

// puntaje necesario para ganar
const SCORE_TO_WIN = 200;

// intervalos de aparición
let tuberiaSpawnInterval = null;
let monedaSpawnInterval = null;
let monedaBonusSpawnInterval = null;
let fantasmaSpawnInterval = null;

let rafId = null; // id del requestAnimationFrame

// colecciones de objetos
const tuberias = [];
const monedas = [];

// velocidades
const tuberiaSpeed = 7;
const monedaSpeed = 7;

// tamaños del pájaro y tuberías
const PAJARO_HEIGHT = 64;
const PAJARO_WIDTH = 32;
const TUBERIA_WIDTH = 30;
const TUBERIA_GAP = 300;

// ajustes de hitbox del pájaro
const PADDING_TOP = 80;
const PADDING_BOTTOM = 80;
const PADDING_SIDE = 30;

// ajustes de hitbox de tuberías
const TUBERIA_PADDING_TOP = 0;
const TUBERIA_PADDING_BOTTOM = 0;
const TUBERIA_PADDING_SIDE = 20;

// reduce la hitbox de la moneda (en px por cada lado)
const MONEDA_HITBOX_PADDING = 50;

// colección de fantasmas (se mueven como tuberías)
const fantasmas = [];

// velocidad / ancho si querés variables específicas (si querés cambiarlo después)
const fantasmaSpeed = 15; 
const FANTASMA_WIDTH = 15; // ancho del fotograma (antes de scale)
const FANTASMA_HEIGHT = 15;




/* ------------------------- ESTADO ------------------------- */
export function isGameOver() {
    return gameOver;
}

/* ------------------------- UTILIDADES DE INTERVALOS ------------------------- */
// limpia todos los intervalos activos
function limpiarIntervalos() {
    clearInterval(tuberiaSpawnInterval);
    clearInterval(monedaSpawnInterval);
    clearInterval(monedaBonusSpawnInterval);
    clearInterval(scoreInterval);
    clearInterval(fantasmaSpawnInterval);

    fantasmaSpawnInterval = null;
    tuberiaSpawnInterval = null;
    monedaSpawnInterval = null;
    monedaBonusSpawnInterval = null;
    scoreInterval = null;
}

// activa los intervalos si no están activos ya
function iniciarIntervalos() {
    if (!tuberiaSpawnInterval) tuberiaSpawnInterval = setInterval(createTuberiaPair, 2000);
    if (!monedaSpawnInterval) monedaSpawnInterval = setInterval(crearMoneda, 1500);
    if (!monedaBonusSpawnInterval) monedaBonusSpawnInterval = setInterval(crearMonedaBonus, 8000);
    if (!fantasmaSpawnInterval) fantasmaSpawnInterval = setInterval(crearFantasma, 2000);

    if (!scoreInterval) {
        scoreInterval = setInterval(() => {
            if (!gameOver && !paused) {
                score += 1;
                const el = document.getElementById("score");
                if (el) el.textContent = score;
            }
        }, 1000);
    }
}


/*-------------------------FONDO ------------------------------*/
function pausarFondos() {
    document.querySelectorAll(".layer").forEach(layer => {
        layer.classList.add("pausa");
    });
}

function reanudarFondos() {
    document.querySelectorAll(".layer").forEach(layer => {
        layer.classList.remove("pausa");
    });
}




/* ------------------------- TUBERÍAS ------------------------- */
// crea un par de tuberías (arriba y abajo)
function createTuberiaPair() {
    if (gameOver || paused) return;

    const minTop = 50;
    const maxTop = gameContainer.clientHeight - TUBERIA_GAP - 50;
    const gapStartTop = Math.floor(Math.random() * (maxTop - minTop + 1)) + minTop;

    const xPos = gameContainer.clientWidth;

    // tubería superior
    const topTuberia = document.createElement("div");
    topTuberia.classList.add("tuberia", "tuberia-invertida");
    topTuberia.style.height = gapStartTop + "px";
    topTuberia.style.left = xPos + "px";
    topTuberia.style.top = "0px";

    gameArea.appendChild(topTuberia);
    tuberias.push(topTuberia);

    // tubería inferior
    const bottomTuberia = document.createElement("div");
    bottomTuberia.classList.add("tuberia");
    bottomTuberia.style.height = (gameContainer.clientHeight - (gapStartTop + TUBERIA_GAP)) + "px";
    bottomTuberia.style.left = xPos + "px";
    bottomTuberia.style.top = (gapStartTop + TUBERIA_GAP) + "px";

    gameArea.appendChild(bottomTuberia);
    tuberias.push(bottomTuberia);
}

// mueve las tuberías hacia la izquierda
function moverTuberias() {
    for (let i = tuberias.length - 1; i >= 0; i--) {
        const tuberia = tuberias[i];
        const x = parseFloat(tuberia.style.left);
        tuberia.style.left = (x - tuberiaSpeed) + "px";

        if (x + TUBERIA_WIDTH < 0) {
            tuberia.remove();
            tuberias.splice(i, 1);
        }
    }
}

/* ------------------------- MONEDAS ------------------------- */
// calcula el próximo hueco entre tuberías
function obtenerGapProximo() {
    for (let i = 0; i < tuberias.length; i += 2) {
        const topT = tuberias[i];
        const x = parseFloat(topT.style.left);
        if (x > gameContainer.clientWidth * 0.6) {
            return topT.getBoundingClientRect().height;
        }
    }
    return null;
}

// crea una moneda normal
function crearMoneda() {
    if (gameOver || paused) return;

    const moneda = document.createElement("div");
    moneda.classList.add("moneda");

    const x = gameContainer.clientWidth + 40;

    let gapTop = null;
    for (let i = 0; i < tuberias.length; i += 2) {
        const topT = tuberias[i];
        const topRect = topT.getBoundingClientRect();
        const tuberiaX = parseFloat(topT.style.left);

        if (tuberiaX > gameContainer.clientWidth * 0.6) {
            gapTop = topRect.height;
            break;
        }
    }

    let y;
    if (gapTop !== null) {
        const gapSpaceTop = gapTop + 40;
        const gapSpaceBottom = gapTop + TUBERIA_GAP - 40;
        y = Math.random() * (gapSpaceBottom - gapSpaceTop) + gapSpaceTop;
    } else {
        const safeTop = 120;
        const safeBottom = gameContainer.clientHeight - 160;
        y = Math.random() * (safeBottom - safeTop) + safeTop;
    }

    moneda.style.left = x + "px";
    moneda.style.top = y + "px";

    gameArea.appendChild(moneda);
    monedas.push(moneda);
}

// crea una moneda bonus
function crearMonedaBonus() {
    if (gameOver || paused) return;

    const moneda = document.createElement("div");
    moneda.classList.add("moneda-bonus");

    const x = gameContainer.clientWidth + 40;
    const gapTop = obtenerGapProximo();

    let y;
    if (gapTop !== null) {
        const min = gapTop + 40;
        const max = gapTop + TUBERIA_GAP - 40;
        y = Math.random() * (max - min) + min;
    } else {
        y = Math.random() * (gameContainer.clientHeight - 200) + 120;
    }

    moneda.style.left = x + "px";
    moneda.style.top = y + "px";

    gameArea.appendChild(moneda);
    monedas.push(moneda);
}

// mueve las monedas hacia la izquierda
function moverMonedas() {
    for (let i = monedas.length - 1; i >= 0; i--) {
        const moneda = monedas[i];
        const x = parseFloat(moneda.style.left);
        moneda.style.left = (x - monedaSpeed) + "px";

        if (x < -30) {
            moneda.remove();
            monedas.splice(i, 1);
        }
    }
}


/*------------------------------ fantasmas-------------------------------------*/


function crearFantasma() {
    if (gameOver || paused) return;

    const fantasma = document.createElement("div");
    fantasma.classList.add("fantasma");

    const x = gameContainer.clientWidth + 40;
    const y = Math.random() * (gameContainer.clientHeight - 120) + 60;

    fantasma.style.left = x + "px";
    fantasma.style.top = y + "px";
    fantasma.style.position = "absolute";   // 👈 NECESARIO

    gameArea.appendChild(fantasma);
    fantasmas.push(fantasma);
}



function moverFantasmas() {
    for (let i = fantasmas.length - 1; i >= 0; i--) {
        const f = fantasmas[i];
        const x = parseFloat(f.style.left);
        f.style.left = (x - fantasmaSpeed) + "px";

        if (x + FANTASMA_WIDTH < 0) {
            f.remove();
            fantasmas.splice(i, 1);
        }
    }
}

function checkfantasmaCollision() {
    const pajaroRect = bird.getBoundingClientRect();

    for (let i = fantasmas.length - 1; i >= 0; i--) {
        const fant = fantasmas[i];
        const rect = fant.getBoundingClientRect();

        // Opcional: achicar hitbox del fantasma si lo querés menos permisivo
        const padding = 50; // reduce o subí este valor según quieras
        const fantHitbox = {
            top: rect.top + padding,
            bottom: rect.bottom - padding,
            left: rect.left + padding,
            right: rect.right - padding
        };

        const overlap =
            pajaroRect.left < fantHitbox.right &&
            pajaroRect.right > fantHitbox.left &&
            pajaroRect.top < fantHitbox.bottom &&
            pajaroRect.bottom > fantHitbox.top;

        if (overlap) {
            // choca con fantasma -> perder
            endGame();
            return true;
        }
    }
    return false;
}





/* ------------------------- COLISIÓN CON MONEDAS ------------------------- */
// detecta si el pájaro recoge una moneda
function checkCoinCollision() {
    const pajaroRect = bird.getBoundingClientRect();
    const monedas = document.querySelectorAll('.moneda, .moneda-bonus');

    monedas.forEach(moneda => {
        const rectOriginal = moneda.getBoundingClientRect();

        const rect = {
            top: rectOriginal.top + MONEDA_HITBOX_PADDING,
            bottom: rectOriginal.bottom - MONEDA_HITBOX_PADDING,
            left: rectOriginal.left + MONEDA_HITBOX_PADDING,
            right: rectOriginal.right - MONEDA_HITBOX_PADDING
        };

        const overlap =
            pajaroRect.left < rect.right &&
            pajaroRect.right > rect.left &&
            pajaroRect.top < rect.bottom &&
            pajaroRect.bottom > rect.top;

        if (overlap) {
            if (moneda.classList.contains('moneda-bonus')) {
                score += 5;
            } else {
                score++;
            }
            moneda.remove();
        }
    });
}

/* ------------------------- COLISIONES CON TUBERÍAS ------------------------- */
function checkCollision() {
    const pajaroRect = bird.getBoundingClientRect();
    const pajaroHitbox = {
        top: pajaroRect.top + PADDING_TOP,
        bottom: pajaroRect.bottom - PADDING_BOTTOM,
        left: pajaroRect.left + PADDING_SIDE,
        right: pajaroRect.right - PADDING_SIDE
    };

    for (const tuberia of tuberias) {
        const rect = tuberia.getBoundingClientRect();
        const tuberiaHitbox = {
            top: rect.top + TUBERIA_PADDING_TOP,
            bottom: rect.bottom - TUBERIA_PADDING_BOTTOM,
            left: rect.left + TUBERIA_PADDING_SIDE,
            right: rect.right - TUBERIA_PADDING_SIDE
        };

        const collisionX =
            pajaroHitbox.left < tuberiaHitbox.right &&
            pajaroHitbox.right > tuberiaHitbox.left;

        const collisionY =
            pajaroHitbox.top < tuberiaHitbox.bottom &&
            pajaroHitbox.bottom > tuberiaHitbox.top;

        if (collisionX && collisionY) {
            endGame();
            return true;
        }
    }

    return false;
}

/* ------------------------- PAUSA ------------------------- */
export function pauseGame() {
    if (paused) return;
    paused = true;
    limpiarIntervalos();
    if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
    }

    pausarFondos();
}

/* ------------------------- REANUDAR ------------------------- */
export function resumeGame() {
    if (!paused || gameOver) return;
    paused = false;

    limpiarIntervalos();
    iniciarIntervalos();

    reanudarFondos();

    if (!rafId) {
        rafId = requestAnimationFrame(update);
    }
}

/* ------------------------- REINICIAR ------------------------- */
export function resetGame() {
    paused = false;
    gameOver = false;

    reanudarFondos();

    limpiarIntervalos();

    tuberias.forEach(p => p.remove());
    monedas.forEach(m => m.remove());
    fantasmas.forEach(f => f.remove());

    fantasmas.length = 0;
    tuberias.length = 0;
    monedas.length = 0;

    iniciarIntervalos();

    velocity = 0;

    bird.style.top = (gameContainer.clientHeight / 2) - (PAJARO_HEIGHT / 2) + "px";
    bird.style.transform = "scale(4) rotate(0deg)";
    bird.classList.remove("muerto");

    score = 0;
    const scoreEl = document.getElementById("score");
    if (scoreEl) scoreEl.textContent = score;

    if (!rafId) rafId = requestAnimationFrame(update);
}

/* ------------------------- INPUT ------------------------- */
document.addEventListener("keydown", (e) => {
    if (e.code === "Space") e.preventDefault();
    if (!gameOver && (e.code === "Space" || e.repeat === false)) {
        velocity = jump;
    }
});

/* ------------------------- LOOP PRINCIPAL ------------------------- */
function update() {
    rafId = null;
    if (gameOver || paused) return;

    moverTuberias();
    moverMonedas();
    moverFantasmas();

    if (checkCollision()) return;
    if (checkfantasmaCollision()) return;
    checkCoinCollision();

    velocity += gravity;
    let y = parseFloat(getComputedStyle(bird).top);
    bird.style.top = (y + velocity) + "px";

    let tilt = velocity * 3;
    tilt = Math.max(-30, Math.min(60, tilt));
    bird.style.transform = `scale(4) rotate(${tilt}deg)`;

    const floor = gameContainer.clientHeight - (PAJARO_HEIGHT * 4 * 0.7);
    if (y <= 0 || y >= floor) {
        return endGame();
    }

    if (score >= SCORE_TO_WIN) {
        return endGame();
    }

    if (!rafId) rafId = requestAnimationFrame(update);
}

/* ------------------------- FIN DEL JUEGO ------------------------- */
function endGame() {
    if (gameOver) return;
    gameOver = true;

    limpiarIntervalos();

    if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
    }

    pausarFondos();

    bird.classList.add("muerto");

    if (score >= SCORE_TO_WIN) {
        const gameWinMenu = document.getElementById("game-win-menu");
        if (gameWinMenu) gameWinMenu.classList.remove("oculto");
    } else {
        const gameOverMenu = document.getElementById("game-over-menu");
        if (gameOverMenu) gameOverMenu.classList.remove("oculto");
    }
}
