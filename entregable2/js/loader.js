let contador = document.getElementById("contador");
let overlay = document.getElementById("loader-overlay");
let tiempoTotal = 5000; // 5.5 segundos
let progreso = 0;
let intervalo = tiempoTotal / 100;

let timer = setInterval(() => {
  progreso++;
  contador.textContent = progreso + "%";
  if (progreso >= 100.1) {
    clearInterval(timer);
    overlay.style.display = "none"; // 👈 Oculta el loader y el blur
  }
}, intervalo);

// === Marcas de porcentaje ===
const g = document.querySelector("svg g");
const cx = 150; // centro
const cy = 150;
const r = 100;

for (let i = 0.5; i <= 10; i++) {
  let ang = Math.PI - (i * Math.PI / 10);
  let x = cx + r * Math.cos(ang);
  let y = cy - r * Math.sin(ang);

  let txt = document.createElementNS("http://www.w3.org/2000/svg", "text");
  txt.setAttribute("x", x);
  txt.setAttribute("y", y);
  txt.textContent = (i * 10) + "%";
  g.appendChild(txt);
}
