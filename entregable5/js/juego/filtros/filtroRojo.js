import Filtro from './filtro.js';
"use strict";

export class FiltroRojo extends Filtro {
      getR(r) { 
            const gris = (this.r + this.g + this.b) / 3;
            return Math.min(255, gris * 1.0);  // rojo principal
      }

      getG(g) { 
            const gris = (this.r + this.g + this.b) / 3;
            return gris * 0.2; // un poquito de verde para suavizar
      }

      getB(b) { 
            const gris = (this.r + this.g + this.b) / 3;
            return gris * 0.2; // un poquito de azul para suavizar
      }
}

export default FiltroRojo;