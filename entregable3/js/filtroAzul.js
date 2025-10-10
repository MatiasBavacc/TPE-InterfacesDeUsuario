import  Filtro  from './filtro.js';
"use strict";
export class FiltroAzul extends Filtro {

      getR(r) { return this.r * 0.8;  }

      getG(g) { return this.g * 0.9;  }

      getB(b) { return Math.min(255, this.b * 1.2);  }
}
export default FiltroAzul;