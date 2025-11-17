import  Filtro  from './filtro.js';
"use strict";
export class FiltroNegativo extends Filtro {

      getR(r) { return 255 - this.r; }

      getG(g) { return 255 - this.g; }

      getB(b) { return 255 - this.b; }
}
export default FiltroNegativo;