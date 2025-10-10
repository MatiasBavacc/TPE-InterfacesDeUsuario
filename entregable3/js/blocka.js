"use strict";
import Figura from "./figura.js";
import Imagen from "./Imagen.js";
import Filtro from './filtros/filtro.js';
import FiltroNegativo from './filtros/filtroNegativo.js';
import FiltroGrises from './filtros/filtroEscalaDeGrises.js';
import FiltroBrillo30 from './filtros/filtroBrillo30.js';
import FiltroSepia  from './filtros/filtroSepia.js';
import FiltroContraste from './filtros/filtroContraste.js';
import FiltroAzul from './filtros/filtroAzul.js';



/** @type { HTMLCanvasElement} */
let canvas = document.getElementById("canvas-game");
/** @type { CanvasRenderingContext2D } */
let ctx = canvas.getContext("2d");

let gameWidth = canvas.width;
let gameHeight = canvas.height;


let imagenes = [];

let image = new Image();
let image2 = new Image();
let image3 = new Image();
let image4 = new Image();

image.src = "img/baldur1.png";
imagenes.push(image);

image2.src = "img/baldur2.png";
imagenes.push(image2);

image3.src = "img/basquet.png";
imagenes.push(image3);

image4.src = "img/peak.jpg";
imagenes.push(image4);


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
      rotarFiguras(figuras);
      gameLoop(figuras);
};


function dibujarFiguras(figuras) {
      ctx.clearRect(0, 0, gameWidth, gameHeight);
      for (let i = 0; i < figuras.length; i++) {
            let figura = figuras[i];
            figura.rotarFigura();
      }
}

function cantidadFiguras(cantW, cantH, image, espacio = 30, posX = 450, posY = 250) {
      let figuras = [];
      let anchoFijo = image.width / cantW;
      let altoFijo = image.height / cantH;

      for (let i = 0; i < cantW; i++) {
            for (let j = 0; j < cantH; j++) {
                  const sprite = new Imagen(
                        image.src, 
                        i * anchoFijo,
                        j * altoFijo,
                        anchoFijo,
                        altoFijo,
                        seleccionarFiltro(Math.round(Math.random() * 3 + 1))
                  );

                  let figura = new Figura(
                        posX + i * (anchoFijo + espacio),
                        posY + j * (altoFijo + espacio),
                        anchoFijo,
                        altoFijo,
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
    
      const boton = event.button;

      if (boton !== 0 && boton !== 2) {
            return; 
      }

      const rect = canvas.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;
      for (let i = figuras.length - 1; i >= 0; i--) { 
            const figura = figuras[i];
            if (figura.estaDentro(mouseX, mouseY)) {
            
                  if (boton === 0) {
                        figura.rotar(-90);
                  } else if (boton === 2) {
                        figura.rotar(90);
                  }
                  
                  dibujarFiguras(figuras); 
                  for(let figura of figuras){
                        if(!figura.posicionCorrecta()){
                              return;
                        }
                  }
                  /* alert("Ganaste!"); */

                  formarImagenCompleta(figuras)
                  break; 
            }
      }
}

function formarImagenCompleta(figuras) {
      figuras = cantidadFiguras(4, 2, imagenes[3],0);
      sacarFiltro(figuras);
      gameLoop(figuras);
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
            /* case 4:
                  filtro = new FiltroSepia();
                  break;
            case 5:
                  filtro = new FiltroContraste(1.6);
                  break;
            case 6:
                  filtro = new FiltroAzul();
                  break; */
            default:
                  filtro = new Filtro();
      }
      return filtro;
}

function rotarFiguras(figuras, grados = 0) {
      let random = Math.random();
      if(grados === 0){
            if(random < 0.3){
                  grados = -90;
            }else if(random >= 0.3 && random < 0.5){
                  grados = 90;
            }else{
                  grados = 180;
            }
      }
      for (let figura of figuras) {
            figura.rotar(grados);
      }
}



function sacarFiltro(figuras) {
      for (let figura of figuras) {
            figura.getSprite().sacarFiltro();
      }
}
