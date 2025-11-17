"use strict";
// Obtenemos los elementos del DOM que el juego necesita
const bird = document.getElementById("bird");
const gameContainer = document.getElementById("game-container");

let velocity;
let gravity = 0.5;
let jump = -8;
let gameOver;

/**
 * Inicia o resetea el juego Flappy Bird.
 * Se exporta para ser llamado desde page-juego.js
 */
export function resetGame() {
    velocity = 0;
    gameOver = false;

    // Posiciona el pájaro en el centro del CONTENEDOR
    const birdHeight = 64 * 4; // 64px de alto base * 4 de escala
    bird.style.top = (gameContainer.clientHeight / 2) - (birdHeight / 2) + "px";
    bird.style.transform = "scale(4) rotate(0deg)";

    // Iniciar el bucle del juego
    update();
}

/**
 * Maneja el salto del pájaro (se exporta para page-juego.js)
 */
export function flappyKeydown(event) {
    // Solo saltar con "Espacio"
    if (event.code === 'Space' && !gameOver) {
        event.preventDefault();
        velocity = jump;
    }
}

/**
 * Bucle principal del juego Flappy Bird (función local)
 */
function update() {
    if (gameOver) return;

    // Física
    velocity += gravity;
    let y = parseFloat(getComputedStyle(bird).top);
    bird.style.top = (y + velocity) + "px";

    // Rotación
    let tilt = velocity * 3;
    if (tilt > 60) tilt = 60;
    if (tilt < -30) tilt = -30;
    bird.style.transform = `scale(4) rotate(${tilt}deg)`;

    // Colisión con techo
    if (y <= 0) {
        return endGame();
    }

    // Colisión con suelo (basado en el CONTENEDOR)
    const birdHeight = 64 * 4;
    const floor = gameContainer.clientHeight - birdHeight; // Usamos el alto del contenedor

    if (y >= floor) {
        return endGame();
    }

    requestAnimationFrame(update);
}

/**
 * Termina el juego y lo reinicia (función local)
 */
function endGame() {
    gameOver = true;
    setTimeout(() => {
        resetGame();
    }, 700);
}