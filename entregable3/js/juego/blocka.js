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
import Cronometro from "./cronometro/cronometro.js";
import CuentaRegresiva from "./cronometro/cuentaRegresiva.js";



/** @type { HTMLCanvasElement} */
let canvas = document.getElementById("canvas-game");
/** @type { CanvasRenderingContext2D } */
let ctx = canvas.getContext("2d");

let gameWidth = canvas.width;
let gameHeight = canvas.height;


const imagenes = [];
const imagenesDistintas = [];
let indiceImagen;
let figuras = [];
let cronometro = new Cronometro();
let dificultad = null;
let nivel = null;

let sonidoFondo = null;
let sonidoRisa = null;

const URL_API = "https://68f1750cb36f9750dee95a6b.mockapi.io/api/blockapi/Timers";


function iniciarNivel(index, partes = 2, filtro) {

      indiceImagen = index;
      
      figuras = cantidadFiguras(partes, 2, imagenesDistintas[index], filtro);

      canvas.addEventListener('mousedown', eventoClick);

      canvas.addEventListener('contextmenu', (e) => {
            e.preventDefault();
      });

      rotarFiguras(figuras);
      cronometro.reiniciar();
      sonidoFondo = reproducirSonido("resourses/sounds/soundtrack.mp3", true, 0.05);
      gameLoop(figuras);
}


function dibujarFiguras(figuras) {
      ctx.clearRect(0, 0, gameWidth, gameHeight);
      for (let i = 0; i < figuras.length; i++) {
            let figura = figuras[i];
            figura.rotarFigura();
      }
}

function cantidadFiguras(cantW, cantH, image, filtro, espacio = 30, color = "rgba(236, 195, 125, 1)", posX = 400, posY = 250) {
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
                        seleccionarFiltro(filtro)
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
      cronometro.mostrarTiempo();
      if (cronometro.finalizo()) {
            //                                                                       ACA VA EL MENU DE PERDISTE
            formarImagenCompleta(figuras);
            return;
      }
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
                  /* alert("Ganaste!");   
                                                                        ACA VA CUANDO GANAS ELIMINAR EL ALERT
                  */

                  formarImagenCompleta(figuras);
                  cronometro.pausar();
                  enviarResultado();
                  break; 
            }
      }
}

function formarImagenCompleta(figuras) {
      figuras = cantidadFiguras(4, 2, imagenesDistintas[indiceImagen],10,-1, "rgba(255, 255, 255, 0)");
      sacarFiltro(figuras);
      gameLoop(figuras);
      sonidoFondo.pause();
      sonidoFondo = reproducirSonido("resourses/sounds/lobby.mp3", true, 0.1);
      sonidoRisa = reproducirSonido("resourses/sounds/risa.mp3", false, 0.7);
      //                                                                      ACA VA EL MENU DE GANASTE O PERDISTE
}

function seleccionarFiltro(number) {
      if(number === 0){
            number = Math.round(Math.random() * 3 + 1);
      }

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
                  break;
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
            figura.getSprite().cargarYAplicar().then(() => {
                  figura.getSprite().sacarFiltro();
            });
      }
}


export function crearImagenes(areaJuego) {
      const contenedorCarrusel = document.createElement("div");
      contenedorCarrusel.classList.add("contenedor-carrusel");

      const contenedorImagenes = document.createElement("div");
      contenedorImagenes.classList.add("contenedor-imagenes");
      let imageRota = new Image();
      let imageRota2 = new Image();
      let imageRota3 = new Image();
      let imageRota4 = new Image();
      let imageRota5 = new Image();
      let imageRota6 = new Image();

      imageRota.src = "resourses/images/metalAuto6.png";
      imagenesDistintas.push(imageRota);
      imageRota2.src = "resourses/images/el-hombre-que-araña.png";
      imagenesDistintas.push(imageRota2);
      imageRota3.src = "resourses/images/llamado-a-don-ramon.png";
      imagenesDistintas.push(imageRota3);
      imageRota4.src = "img/peak.jpg";
      imagenesDistintas.push(imageRota4);
      imageRota5.src = "img/mgs-blocka.png";
      imagenesDistintas.push(imageRota5);
      imageRota6.src = "img/fnv-blocka3.png";
      imagenesDistintas.push(imageRota6);

      let image = new Image();
      let image2 = new Image();
      let image3 = new Image();
      let image4 = new Image();
      let image5 = new Image();
      let image6 = new Image();
      
      image.src = "resourses/images/gta-6.jpg";
      imagenes.push(image);
      image2.src = "resourses/images/el-hombre-araña.jpg";
      imagenes.push(image2);
      image3.src = "resourses/images/call-of-duty.png";
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
            seleccionarNivel(1, randomIndex % imagenes.length); /* ACA HAY QUE REMPALAZAR ESTE LLAMADO POR EL QUE LLAMA A SELECCIONAR LA nivel ( NIVEL HARDCODEADO)*/
            contenedor.remove();
      }, randomIndex * 1000);
}

function seleccionarNivel(nivelSeleccionado, imagen) {
      nivel = nivelSeleccionado;
      seleccionarDificultad("dificil", imagen);             // DIFICULTAD HARDCODEADA, ACA VA LA DIFICULTAD QUE SELECCIONA EL USUARIO
}

function seleccionarDificultad(dificultadActual, imagen){
      switch (dificultadActual) {
            case 'facil':
                  dificultad = "facil";
                  cronometro = new Cronometro();
                  iniciarNivel(imagen, 2, 3);
                  break;
            case 'medio':
                  dificultad = "medio";
                  cronometro = new CuentaRegresiva(60);
                  iniciarNivel(imagen, 3, 2);
                  break;
            case 'dificil':
                  dificultad = "dificil";
                  cronometro = new CuentaRegresiva(30);
                  iniciarNivel(imagen, 4, 1);
                  break;
            case 'enemigos':
                  dificultad = "enemigos";
                  cronometro = new CuentaRegresiva(30);
                  iniciarNivel(imagen, 4, 0);
                  break;
            default:
                  cronometro = new Cronometro();
                  iniciarNivel(imagen, 3, 2);
                  break;
      }
}


/* ACA VA LA FUNCION DE MOSTRAR EL MENU INICIAL Y SELECCIONAR LA DIFICULTAD */



function reproducirSonido(src, loop = true, volumen = 0.1) {
      let sonido = new Audio(src);
      sonido.loop = loop;
      sonido.volume = volumen;
      sonido.play();
      return sonido;
}

async function enviarResultado() {
      let nivelActual = nivel;
      let id;
      let dificultadActual = dificultad;
      switch (dificultadActual) {
            case 'facil':
                  id = nivelActual * 1;
                  break;
            case 'medio':
                  id = nivelActual * 2;
                  break;
            case 'dificil':
                  id = nivelActual * 3;
                  break;
            case 'enemigos':
                  id = nivelActual * 4;
                  break;
            default:
                  break;
      }
      
      let nombre = document.getElementById("nombreJugador").textContent;
      let tiempo = cronometro.getTiempoFinal();
      let tiemposLocales = await getTiempos(id);

      for (let i = 0; i < tiemposLocales.length; i++) {
            if(tiemposLocales[i].tiempo > tiempo){
                  tiemposLocales.splice(i, 0, { "nombre": nombre, "tiempo": tiempo });
                  break;
            }
      }

      if(tiemposLocales.length > 8){
            tiemposLocales.pop();
      }

      tiemposLocales.sort((a, b) => a.tiempo - b.tiempo);

      const resultado = {
            "nivel": nivelActual,
            "dificultad": dificultadActual,
            "tiempos" : tiemposLocales
      };

      try {
            const response = await fetch(URL_API + "/" + id, {
                  method: "PUT",
                  headers: {
                        "Content-Type": "application/json"
                  },
                  body: JSON.stringify(resultado)
            });

            if (!response.ok) {
                  throw new Error("Error al enviar el resultado");
            }

            const data = await response.json();
            console.log("Resultado enviado:", data);
      } catch (error) {
            console.error("Error:", error);
      }
}

async function getTiempos(id) {
      try {
            const response = await fetch(URL_API + "/" + id);
            const data = await response.json();
            data.tiempos.sort((a, b) => a.tiempo - b.tiempo);
            return data.tiempos;
      } catch (error) {
            console.error("Error:", error);
            return [];
      }
}

export default crearImagenes;


