let overlay = document.getElementById("loader-overlay");
let contador = document.getElementById("contador");
let tiempoTotal = 5000; 
let progreso = 0;
let intervalo = tiempoTotal / 100; 
const elipse = document.getElementById("elipse-dinamica");

let timer = setInterval(() => {
  progreso++;
  contador.textContent = progreso + "%";

  // Ver quién va ganando
  const block1 = document.querySelector(".block1");
  const block2 = document.querySelector(".block2");

  if (block1.offsetWidth > block2.offsetWidth) {
    elipse.setAttribute("fill", "var(--color-acento)"); // dorado
  } else {
    elipse.setAttribute("fill", "var(--color-primario)"); // azul
  }

  if (progreso >= 100.1){
    clearInterval(timer);
    overlay.style.display = "none"; // 👈 Oculta el loader y el blur
  } 
}, intervalo);

  // Partículas en borde
  function createParticle(x, y) {
    const box = document.getElementById("loaderBox");
    const p = document.createElement("div");
    p.classList.add("particle");
    p.style.background = Math.random() > 0.5 ? "var(--color-acento)" : "var(--color-primario)";
    p.style.left = x + "px";
    p.style.top = y + "px";
    const dx = (Math.random() - 0.5) * 100 + "px";
    const dy = (Math.random() - 0.5) * 60 + "px";
    p.style.setProperty("--dx", dx);
    p.style.setProperty("--dy", dy);
    box.appendChild(p);
    p.addEventListener("animationend", () => p.remove());
  }

  const loop = setInterval(() => {
    const block1 = document.querySelector(".block1");
    const rect1 = block1.getBoundingClientRect();
    const box = document.getElementById("loaderBox");
    const boxRect = box.getBoundingClientRect();
    const x = rect1.right - boxRect.left;
    const y = box.offsetHeight / 2;
    for (let i = 0; i < 3; i++) createParticle(x, y);
  }, 100);

  setTimeout(() => clearInterval(loop), tiempoTotal);
