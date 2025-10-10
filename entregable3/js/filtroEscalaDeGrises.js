import Filtro from './filtro.js';
"use strict";
export class FiltroEscalaDeGrises extends Filtro {

      getGrises(){ return Math.round(0.299 * this.r + 0.587 * this.g + 0.114 * this.b); }

      getR(r) { return this.getGrises(); }

      getG(g) { return this.getGrises(); }

      getB(b) { return this.getGrises(); }
}
export default FiltroEscalaDeGrises;