import  Filtro  from './filtro.js';
"use strict";
export class FiltroSepia extends Filtro {

      getR(r) { return  Math.min(255, this.r*0.393 + this.g*0.769 + this.b*0.189); }

      getG(g) { return  Math.min(255, this.r*0.349 + this.g*0.686 + this.b*0.168); }

      getB(b) { return  Math.min(255, this.r*0.272 + this.g*0.534 + this.b*0.131); }
}
export default FiltroSepia;