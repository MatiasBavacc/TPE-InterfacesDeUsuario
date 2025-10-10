"use strict";
import Figura from "./figura.js";
import Imagen from "./Imagen.js";
import Filtro from './filtro.js';
import FiltroNegativo from './filtroNegativo.js';
import FiltroGrises from './filtroEscalaDeGrises.js';
import FiltroBrillo30 from './filtroBrillo30.js';
import FiltroSepia  from './filtroSepia.js';
import FiltroContraste from './filtroContraste.js';
import FiltroAzul from './filtroAzul.js';



/** @type { HTMLCanvasElement} */
let canvas = document.getElementById("canvas-game");
/** @type { CanvasRenderingContext2D } */
let ctx = canvas.getContext("2d");

let gameWidth = canvas.width;
let gameHeight = canvas.height;

let imagenes = [];

let image = new Image();
image.src = "img/baldur1.png";
imagenes.push(image);

image.src = "img/baldur2.png";
imagenes.push(image);

image.src = "img/basquet.png";
imagenes.push(image);

image.src = "img/peak.jpg";
imagenes.push(image);


imagenes[3].onerror = () => {
      console.warn(`No se pudo cargar ${imagenes[3].src}. Usando imagen de fallback.`);
      imagenes[3].src = "https://placehold.co/1400x787/38bdf8/0369a1/png?text=Algo+Salio+Mal";
};

let figuras = [];

imagenes[3].onload = () => {
      figuras = cantidadFiguras(4, 2, imagenes[3]);
      canvas.addEventListener('mousedown', eventoClick);

      canvas.addEventListener('contextmenu', (e) => {
            e.preventDefault();
      }); 

      gameLoop(figuras);
      /* sacarFiltro(figuras); */
};


function dibujarFiguras(figuras) {
      ctx.clearRect(0, 0, gameWidth, gameHeight); // Limpia el canvas
      for (let i = 0; i < figuras.length; i++) {
            let figura = figuras[i];
            figura.rotarFigura();
      }
}

function cantidadFiguras(cantW, cantH, image, posX = 400, posY = 250) {
      let figuras = [];
      let anchoFijo = image.width / cantW; // ancho de cada trozo
      let altoFijo = image.height / cantH; // alto de cada trozo
      const espacio = 30; // Espaciado entre trozos

      for (let i = 0; i < cantW; i++) {
            for (let j = 0; j < cantH; j++) {
                  
                  // 1. Crear el objeto IMAGEN (el sprite/trozo)
                  const sprite = new Imagen(
                        image.src, 
                        i * anchoFijo, // Eje X inicial (recorte)
                        j * altoFijo,  // Eje Y inicial (recorte)
                        anchoFijo,     // Ancho de recorte
                        altoFijo,       // Alto de recorte
                        seleccionarFiltro(Math.round(Math.random() * 6 + 1))
                  );

                  // 2. Crear la FIGURA y pasarle el objeto IMAGEN
                  let figura = new Figura(
                        posX + i * (anchoFijo + espacio), // posición en canvas (x) con espaciado
                        posY + j * (altoFijo + espacio), // posición en canvas (y) con espaciado
                        anchoFijo,// ancho
                        altoFijo, // alto
                        "rgba(236, 195, 125, 1)",
                        sprite,
                        ctx
                  );

                  figuras.push(figura);
            }

      }
      return figuras;
}

function gameLoop(figuras) {
      dibujarFiguras(figuras);
      requestAnimationFrame(() => gameLoop(figuras));
}

function eventoClick(event) {
    
      const boton = event.button; // 0 = Izquierdo, 2 = Derecho

      if (boton !== 0 && boton !== 2) {
            return; 
      }

      // Obtener la posición del clic respecto al canvas
      const rect = canvas.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;


      // Recorrer las figuras
      for (let i = figuras.length - 1; i >= 0; i--) { 
            const figura = figuras[i];

            if (figura.estaDentro(mouseX, mouseY)) {
            
                  // Llama a la única función 'rotar' con el parámetro adecuado
                  if (boton === 0) {
                        figura.rotar(-90); // Clic Izquierdo: -90 grados
                  } else if (boton === 2) {
                        figura.rotar(90); // Clic Derecho: +90 grados (rotación inversa)
                  }
                  
                  dibujarFiguras(figuras); 
                  break; 
            }
      }

}

function seleccionarFiltro(number) {
      let filtro;
      switch (number) {
            case 1:
                  filtro = new FiltroNegativo();
                  break;
            case 2:
                  filtro = new FiltroGrises();
                  break;
            case 3:
                  filtro = new FiltroBrillo30();
                  break;
            case 4:
                  filtro = new FiltroSepia();
                  break;
            case 5:
                  filtro = new FiltroContraste(1.6);
                  break;
            case 6:
                  filtro = new FiltroAzul();
                  break;
            default:
                  filtro = new Filtro(); // Filtro neutro (no cambia nada)
      }
      return filtro;
}



function sacarFiltro(figuras) {
      for (let figura of figuras) {
            figura.getSprite().sacarFiltro();
      }
}
