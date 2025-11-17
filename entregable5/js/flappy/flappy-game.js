"use strict";

const bird = document.getElementById("bird");
const gameContainer = document.getElementById("game-container");
const gameArea = document.getElementById("flappy-bird-game"); 

let velocity;
let gravity = 0.3;
let jump = -8;
let gameOver;
let tuberiaSpawnInterval; 
const tuberias = []; 

// --- Configuración de Juego ---
const tuberiaSpeed = 7; 
const PAJARO_HEIGHT = 64; 
const PAJARO_WIDTH = 32; 
const TUBERIA_WIDTH = 64;
const TUBERIA_GAP = 200; 

// --- Configuración de Hitbox
const PADDING_TOP = 15; 
const PADDING_BOTTOM = 10; 
const PADDING_SIDE = 10;

// === FUNCIONES DE TUBERÍAS ====

function createTuberiaPair() {

  // 1. Calcular el punto de inicio del hueco (TOP del hueco)
  const minTop = 50; 
  const maxTop = gameContainer.clientHeight - TUBERIA_GAP - 50;
  const gapStartTop = Math.floor(Math.random() * (maxTop - minTop + 1)) + minTop;

  // Posición X inicial (fuera de la pantalla)
  let xPos = gameContainer.clientWidth;
  
  // --- Tubería Superior ---
  const topTuberia = document.createElement("div");
  const topTuberiaHeight = gapStartTop; 
  
  topTuberia.classList.add("tuberia");
  topTuberia.style.height = topTuberiaHeight + "px";
  topTuberia.style.left = xPos + "px";
  topTuberia.style.top = "0px"; 

  gameArea.appendChild(topTuberia);
  tuberias.push(topTuberia);

  // --- Tubería Inferior ---
  const bottomTuberia = document.createElement("div");
  const bottomTuberiaTop = gapStartTop + TUBERIA_GAP;
  const bottomTuberiaHeight = gameContainer.clientHeight - bottomTuberiaTop; 

  bottomTuberia.classList.add("tuberia");
  bottomTuberia.style.height = bottomTuberiaHeight + "px";
  bottomTuberia.style.left = xPos + "px";
  bottomTuberia.style.top = bottomTuberiaTop + "px"; 

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


function checkCollision() {
  const pajaroRect = bird.getBoundingClientRect(); 
  const pajaroHitbox = {
    top: pajaroRect.top + PADDING_TOP, 
    bottom: pajaroRect.bottom - PADDING_BOTTOM, 
    left: pajaroRect.left + PADDING_SIDE,
    right: pajaroRect.right - PADDING_SIDE,
  };

  for (const tuberia of tuberias) {
    const tuberiaRect = tuberia.getBoundingClientRect(); 
    
    const collisionX = pajaroHitbox.left < tuberiaRect.right && pajaroHitbox.right > tuberiaRect.left;
    const collisionY = pajaroHitbox.top < tuberiaRect.bottom && pajaroHitbox.bottom > tuberiaRect.top;

    if (collisionX && collisionY) {
      endGame();
      return true;
    }
  }
  return false;
}

/*Inicia o resetea el juego Flappy*/
export function resetGame() { 
  // Detener la generación y eliminar tuberías
  clearInterval(tuberiaSpawnInterval); 
  tuberias.forEach(p => p.remove());
  tuberias.length = 0; 
  
  // Iniciar la generación de tuberías (cada 2 segundos)
  tuberiaSpawnInterval = setInterval(createTuberiaPair, 2000); 

  // Resetear variables y posición del pájaro
  velocity = 0;
  gameOver = false;
  bird.style.top = (gameContainer.clientHeight / 2) - (PAJARO_HEIGHT / 2) + "px"; 
  bird.style.transform = "scale(4) rotate(0deg)";
    bird.classList.remove("muerto");

  // Iniciar loop
  update();
}

/* Maneja el salto del pájaro*/
document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    e.preventDefault(); 
  }
  
  if (!gameOver && (e.code === "Space" || e.repeat === false)) {
    velocity = jump;
  }
});

/*Bucle principal del juego Flappy Bird*/
function update() {
  if (gameOver) return;

  // 1. Mover tuberías y detectar colisión con ellas
  moverTuberias();
  if (checkCollision()) {
    return; 
  }

  // 2. Física del pájaro
  velocity += gravity;
  let y = parseFloat(getComputedStyle(bird).top);
  bird.style.top = (y + velocity) + "px";

  // 3. Rotación
  let tilt = velocity * 3;
  if (tilt > 60) tilt = 60;
  if (tilt < -30) tilt = -30;
  bird.style.transform = `scale(4) rotate(${tilt}deg)`;

  // 4. Colisión con suelo y techo (Usa la posición visual)
  const floor = gameContainer.clientHeight - (PAJARO_HEIGHT * 4 * 0.7); // 0.7 es un ajuste por el padding

  if (y <= 0 || y >= floor) {
    return endGame();
  }
  
  requestAnimationFrame(update);
}

/*Termina el juego y lo reinicia*/
function endGame() {
    if (gameOver) return; // Evita que se llame múltiples veces
  gameOver = true;
  clearInterval(tuberiaSpawnInterval);
  // Aplicar animación de muerte
  bird.classList.add("muerto");

  setTimeout(() => {
    bird.classList.remove("muerto"); // vuelve a volar al reiniciar
    resetGame();
  }, 700);
}