import Filtro from './filtro.js';
"use strict";

export class FiltroTonoVerde extends Filtro {
      getR(r) { 
            const gris = (this.r + this.g + this.b) / 3;
            return gris * 0.2;  // un poquito de rojo
      }

      getG(g) { 
            const gris = (this.r + this.g + this.b) / 3;
            return Math.min(255, gris * 1.0); // verde principal
      }

      getB(b) { 
            const gris = (this.r + this.g + this.b) / 3;
            return gris * 0.2; // un poquito de azul para suavizar
      }
}

export default FiltroTonoVerde;