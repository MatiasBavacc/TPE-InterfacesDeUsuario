// flappy-game.js
"use strict";

/* ------------------------- ELEMENTOS ------------------------- */
const bird = document.getElementById("bird");
const gameContainer = document.getElementById("game-container");
const gameArea = document.getElementById("flappy-bird-game");

/* ------------------------- VARIABLES ------------------------- */
let paused = false;
let pauseCallback = null; 
let velocity = 0;
const gravity = 0.3;
const jump = -8;

export let gameOver = false;
let score = 0;
let scoreInterval;

const SCORE_TO_WIN = 50;

let tuberiaSpawnInterval;
let monedaSpawnInterval;

const tuberias = [];
const monedas = [];

const tuberiaSpeed = 7;
const monedaSpeed = 7;

const PAJARO_HEIGHT = 64;
const PAJARO_WIDTH = 32;
const TUBERIA_WIDTH = 30;
const TUBERIA_GAP = 300;

const PADDING_TOP = 80;
const PADDING_BOTTOM = 80;
const PADDING_SIDE = 30;

const TUBERIA_PADDING_TOP = 0;
const TUBERIA_PADDING_BOTTOM = 0;
const TUBERIA_PADDING_SIDE = 20;

export function isGameOver() {
    return gameOver;
}


/* ------------------------- TUBERÍAS ------------------------- */
function createTuberiaPair() {
    const minTop = 50;
    const maxTop = gameContainer.clientHeight - TUBERIA_GAP - 50;
    const gapStartTop = Math.floor(Math.random() * (maxTop - minTop + 1)) + minTop;

    let xPos = gameContainer.clientWidth;

    const topTuberia = document.createElement("div");
    topTuberia.classList.add("tuberia", "tuberia-invertida");
    topTuberia.style.height = gapStartTop + "px";
    topTuberia.style.left = xPos + "px";
    topTuberia.style.top = "0px";

    gameArea.appendChild(topTuberia);
    tuberias.push(topTuberia);

    const bottomTuberia = document.createElement("div");
    bottomTuberia.classList.add("tuberia");
    bottomTuberia.style.height = (gameContainer.clientHeight - (gapStartTop + TUBERIA_GAP)) + "px";
    bottomTuberia.style.left = xPos + "px";
    bottomTuberia.style.top = (gapStartTop + TUBERIA_GAP) + "px";

    gameArea.appendChild(bottomTuberia);
    tuberias.push(bottomTuberia);
}

function moverTuberias() {
    for (let i = tuberias.length - 1; i >= 0; i--) {
        const tuberia = tuberias[i];
        let x = parseFloat(tuberia.style.left);
        tuberia.style.left = (x - tuberiaSpeed) + "px";

        if (x + TUBERIA_WIDTH < 0) {
            tuberia.remove();
            tuberias.splice(i, 1);
        }
    }
}


/* ------------------------- MONEDAS ------------------------- */
function crearMoneda() {
    const moneda = document.createElement("div");
    moneda.classList.add("moneda");

    const x = gameContainer.clientWidth + 40;

    let gapTop = null;
    let gapBottom = null;

    for (let i = 0; i < tuberias.length; i += 2) {
        const topT = tuberias[i];
        const bottomT = tuberias[i + 1];

        const topRect = topT.getBoundingClientRect();
        const bottomRect = bottomT.getBoundingClientRect();

        const tuberiaX = parseFloat(topT.style.left);

        if (tuberiaX > gameContainer.clientWidth * 0.6) {
            gapTop = topRect.height;
            gapBottom = bottomRect.top - topRect.bottom;
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

function moverMonedas() {
    for (let i = monedas.length - 1; i >= 0; i--) {
        const moneda = monedas[i];
        let x = parseFloat(moneda.style.left);
        moneda.style.left = (x - monedaSpeed) + "px";

        if (x < -30) {
            moneda.remove();
            monedas.splice(i, 1);
        }
    }
}

function checkCoinCollision() {
    const pajaroRect = bird.getBoundingClientRect();

    for (let i = monedas.length - 1; i >= 0; i--) {
        const moneda = monedas[i];
        const rect = moneda.getBoundingClientRect();

        const overlap =
            pajaroRect.left < rect.right &&
            pajaroRect.right > rect.left &&
            pajaroRect.top < rect.bottom &&
            pajaroRect.bottom > rect.top;

        if (overlap) {
            score += 5;
            document.getElementById("score").textContent = score;

            moneda.remove();
            monedas.splice(i, 1);
        }
    }
}


/* ------------------------- COLISIONES ------------------------- */
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

export function pauseGame() {
    paused = true;
    clearInterval(tuberiaSpawnInterval);
    clearInterval(monedaSpawnInterval);
    clearInterval(scoreInterval);
}

export function resumeGame() {
    if (!paused) return;

    paused = false;

    // limpiar intervalos previos antes de crear nuevos
    clearInterval(tuberiaSpawnInterval);
    clearInterval(monedaSpawnInterval);
    clearInterval(scoreInterval);

    // reactivar timers
    tuberiaSpawnInterval = setInterval(createTuberiaPair, 2000);
    monedaSpawnInterval = setInterval(crearMoneda, 1500);

    scoreInterval = setInterval(() => {
        if (!gameOver && !paused) {
            score += 1;
            document.getElementById("score").textContent = score;
        }
    }, 1000);

    requestAnimationFrame(update);
}
/* ------------------------- RESET ------------------------- */
export function resetGame() {
    paused = false;  
    gameOver = false;   

    clearInterval(tuberiaSpawnInterval);
    clearInterval(monedaSpawnInterval);

    tuberias.forEach(p => p.remove());
    monedas.forEach(m => m.remove());

    tuberias.length = 0;
    monedas.length = 0;

    tuberiaSpawnInterval = setInterval(createTuberiaPair, 2000);
    monedaSpawnInterval = setInterval(crearMoneda, 1500);

    velocity = 0;
    gameOver = false;

    bird.style.top = (gameContainer.clientHeight / 2) - (PAJARO_HEIGHT / 2) + "px";
    bird.style.transform = "scale(4) rotate(0deg)";
    bird.classList.remove("muerto");

    score = 0;
    document.getElementById("score").textContent = score;

    clearInterval(scoreInterval);
    scoreInterval = setInterval(() => {
        if (!gameOver) {
            score += 1;
            document.getElementById("score").textContent = score;
        }
    }, 1000);

    update();
}


/* ------------------------- INPUT ------------------------- */
document.addEventListener("keydown", (e) => {
    if (e.code === "Space") e.preventDefault();
    if (!gameOver && (e.code === "Space" || e.repeat === false)) {
        velocity = jump;
    }
});


/* ------------------------- LOOP ------------------------- */
function update() {
    if (gameOver || paused) return;

    moverTuberias();
    moverMonedas();

    if (checkCollision()) return;
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
        endGame();
        return;
    }

    requestAnimationFrame(update);
}


/* ------------------------- GAME OVER ------------------------- */
function endGame() {
    if (gameOver) return;
    gameOver = true;

    clearInterval(scoreInterval);
    clearInterval(tuberiaSpawnInterval);
    clearInterval(monedaSpawnInterval);

    bird.classList.add("muerto");

    if (score >= SCORE_TO_WIN) {
        const gameWinMenu = document.getElementById("game-win-menu");
        if (gameWinMenu) {
            gameWinMenu.classList.remove("oculto");
        }
    } else {
        const gameOverMenu = document.getElementById("game-over-menu");
        if (gameOverMenu) {
            gameOverMenu.classList.remove("oculto");
        }
    }
}
