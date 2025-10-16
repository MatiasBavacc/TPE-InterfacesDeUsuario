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
/* import Contador from "./contador.js"; */



/** @type { HTMLCanvasElement} */
let canvas = document.getElementById("canvas-game");
/** @type { CanvasRenderingContext2D } */
let ctx = canvas.getContext("2d");

let gameWidth = canvas.width;
let gameHeight = canvas.height;


const imagenes = [];
let indiceImagen;
let figuras = [];


function iniciarNivel(index) {
      indiceImagen = index;

      figuras = cantidadFiguras(4, 2, imagenes[index]);
      canvas.addEventListener('mousedown', eventoClick);

      canvas.addEventListener('contextmenu', (e) => {
            e.preventDefault();
      });
      rotarFiguras(figuras);
      gameLoop(figuras);
}


function dibujarFiguras(figuras) {
      ctx.clearRect(0, 0, gameWidth, gameHeight);
      for (let i = 0; i < figuras.length; i++) {
            let figura = figuras[i];
            figura.rotarFigura();
      }
}

function cantidadFiguras(cantW, cantH, image, espacio = 30, color = "rgba(236, 195, 125, 1)", posX = 450, posY = 250) {
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
                        color,
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
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;

      const mouseX = (event.clientX - rect.left) * scaleX;
      const mouseY = (event.clientY - rect.top) * scaleY;
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
      figuras = cantidadFiguras(4, 2, imagenes[indiceImagen],-1, "rgba(255, 255, 255, 0)");
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
      let random = 0;
      let nuevoGrado = grados;
      for (let figura of figuras) {
            if(nuevoGrado === 0){
                  grados = 0;
                  random = Math.round(Math.random() * 10 + 1);
            }
            if(grados === 0){
                  if(random < 4){
                        grados = -90;
                  }else if(random >= 4 && random < 7){
                        grados = 90;
                  }else{
                        grados = 180;
                  }
            }
            figura.rotar(grados);
      }
}



function sacarFiltro(figuras) {
      for (let figura of figuras) {
            figura.getSprite().sacarFiltro();
      }
}


export function crearImagenes(areaJuego) {
      const contenedorCarrusel = document.createElement("div");
      contenedorCarrusel.classList.add("contenedor-carrusel");

      const contenedorImagenes = document.createElement("div");
      contenedorImagenes.classList.add("contenedor-imagenes");
      

      let image = new Image();
      let image2 = new Image();
      let image3 = new Image();
      let image4 = new Image();
      let image5 = new Image();
      let image6 = new Image();
      
      image.src = "img/baldur1.png";
      imagenes.push(image);
      image2.src = "img/baldur2.png";
      imagenes.push(image2);
      image3.src = "img/basquet.png";
      imagenes.push(image3);
      image4.src = "img/peak.jpg";
      imagenes.push(image4);
      image5.src = "img/mgs-blocka.png";
      imagenes.push(image5);
      image6.src = "img/fnv-blocka3.png";
      imagenes.push(image6);

      for (let img of imagenes) {
            let imgNew = document.createElement("img");
            imgNew.src = img.src;
            imgNew.classList.add("seleccionable");
            contenedorImagenes.appendChild(imgNew);
      }

      contenedorCarrusel.appendChild(contenedorImagenes);
      areaJuego.appendChild(contenedorCarrusel);
      rotarCarrusel();
}

function rotarCarrusel() {
      const contenedor = document.querySelector('.contenedor-imagenes');
      const imagenes = document.querySelectorAll('.seleccionable');
      let index = 0;

      function centrarImagen() {
            const anchoContenedor = document.querySelector('.contenedor-carrusel').offsetWidth;
            const anchoImagen = imagenes[0].offsetWidth;
            const espacio = 10;
            const desplazamiento = (anchoImagen + espacio) * index - (anchoContenedor / 2 - anchoImagen / 2);

            contenedor.style.transform = `translateX(${-desplazamiento}px)`;

            imagenes.forEach(img => img.classList.remove('activa'));
            imagenes[index].classList.add('activa');
      }

      function siguienteImagen() {
            index++;
            if (index >= imagenes.length) index = 0;
                  centrarImagen();
      }

      const randomIndex = Math.round(Math.random() * imagenes.length);
      centrarImagen();
      for (let i = 0; i < randomIndex; i++) {
            setTimeout(siguienteImagen, i * 1000);
      }
      setTimeout(() => {
            iniciarNivel(randomIndex % imagenes.length);
            contenedor.remove();
      }, randomIndex * 1000);
}
export default crearImagenes;


