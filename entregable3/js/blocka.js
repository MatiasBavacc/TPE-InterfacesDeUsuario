"use strict";
import Figura from "./figura.js";
import Imagen from "./Imagen.js";
import Filtro from "./filtro.js";
import FiltroNegativo from "./filtroNegativo.js";
import FiltroBrillo30 from "./filtroBrillo30.js";
import FiltroEscalaDeGrises from "./filtroEscalaDeGrises.js";

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


// Fallback si la imagen original no carga (para que el ejemplo funcione)
imagenes[3].onerror = () => {
      console.warn(`No se pudo cargar ${imagenes[3].src}. Usando imagen de fallback.`);
      imagenes[3].src = "https://placehold.co/1400x787/38bdf8/0369a1/png?text=Algo+Salio+Mal";
};

let figuras = [];

imagenes[3].onload = () => {
      figuras = cantidadFiguras(3, 2, imagenes[3]);
      canvas.addEventListener('mousedown', handleClick);

      canvas.addEventListener('contextmenu', (e) => {
            e.preventDefault();
      }); // Evita y tambien Peron, pero mas Evita que se abra el menú contextual en clic derecho

      gameLoop(figuras); // Usamos un loop para mostrar la rotación de un trozo.
};


function dibujarFiguras(figuras) {
      ctx.clearRect(0, 0, gameWidth, gameHeight); // Limpia el canvas
      for (let i = 0; i < figuras.length; i++) {
            let figura = figuras[i];
            figura.rotarFigura();
      }
      figuras[0].sprite.aplicarFiltro(ctx, 0, 0, figuras[0].getAncho(), figuras[0].getAlto(), new FiltroEscalaDeGrises());
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
                        altoFijo       // Alto de recorte
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

function handleClick(event) {
    
      const boton = event.button; // 0 = Izquierdo, 2 = Derecho

      if (boton !== 0 && boton !== 2) {
            return; 
      }

      // ... código para obtener mouseX y mouseY ...

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

// --- Funciones Utilitarias de Píxel (Mantenidas para referencia) ---

function setPixel(imageData, x, y, r, g, b, a) {
      const index = (x + y * imageData.width) * 4;
      imageData.data[index + 0] = r;
      imageData.data[index + 1] = g;
      imageData.data[index + 2] = b;
      imageData.data[index + 3] = a;
}

function getPixel(imageData, x, y) {
      const index = (x + y * imageData.width) * 4;
      const r = imageData.data[index + 0];
      const g = imageData.data[index + 1];
      const b = imageData.data[index + 2];
      const a = imageData.data[index + 3];
      return { r, g, b, a };
}


function getImageDataFromImage(img) {
      const tempCanvas = document.createElement("canvas");
      const tempCtx = tempCanvas.getContext("2d");
      tempCanvas.width = img.width;
      tempCanvas.height = img.height;
      tempCtx.drawImage(img, 0, 0);
      return tempCtx.getImageData(0, 0, img.width, img.height);
}