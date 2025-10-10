import  Filtro  from './filtro.js';
"use strict";
export class FiltroContraste extends Filtro {
      constructor(contraste = 1.2) {
            super();
            this.contraste = contraste;
      }

      getR(r) { return Math.min(255, Math.max(0, (this.r - 128) * this.contraste + 128));  }

      getG(g) { return Math.min(255, Math.max(0, (this.g - 128) * this.contraste + 128));  }

      getB(b) { return Math.min(255, Math.max(0, (this.b - 128) * this.contraste + 128));  }
}
export default FiltroContraste;