const bird = document.getElementById("bird");

let velocity;
let gravity = 0.5;
let jump = -8;
let gameOver;

function resetGame() {
    // Resetear variables
    velocity = 0;
    gameOver = false;

    // Poner el pájaro en el medio de la pantalla
    bird.style.top = (window.innerHeight / 2) - 32 + "px";

    // Resetear rotación
    bird.style.transform = "scale(4) rotate(0deg)";

    // Iniciar loop
    update();
}

// Salto con tecla
document.addEventListener("keydown", () => {
    if (!gameOver) {
        velocity = jump;
    }
});

function update() {
    if (gameOver) return;

    // Física
    velocity += gravity;
    let y = parseFloat(getComputedStyle(bird).top);
    bird.style.top = (y + velocity) + "px";

    // Rotación según velocidad
    let tilt = velocity * 3;
    if (tilt > 60) tilt = 60;
    if (tilt < -30) tilt = -30;
    bird.style.transform = `scale(4) rotate(${tilt}deg)`;

    // ==== COLISIÓN CON TECHO ====
    if (y <= 0) {
        return endGame();
    }

    // ==== COLISIÓN CON SUELO ====
    const birdHeight = 64 * 4; // altura real tras escalar ×4
    const floor = window.innerHeight - birdHeight;

    if (y >= floor) {
        return endGame();
    }

    requestAnimationFrame(update);
}

function endGame() {
    gameOver = true;

    // Pequeña pausa para que se note la muerte
    setTimeout(() => {
        resetGame();
    }, 700);
}

// Iniciar todo
resetGame();
