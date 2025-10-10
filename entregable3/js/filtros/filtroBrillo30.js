import Filtro from './filtro.js';
"use strict";
export class FiltroBrillo30 extends Filtro {

      getR(r) { return Math.min(Math.round(this.r * 0.30), 255); }

      getG(g) { return Math.min(Math.round(this.g * 0.30), 255); }

      getB(b) { return Math.min(Math.round(this.b * 0.30), 255); }

}
export default FiltroBrillo30;