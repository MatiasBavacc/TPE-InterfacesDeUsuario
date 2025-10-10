"use strict";
export class Filtro {
      constructor(r = 0, g = 0, b = 0, a = 0) {
            this.r = r;
            this.g = g;
            this.b = b;
            this.a = a;
      }

      getR(r) { return this.r; }

      getG(g) { return this.g; }

      getB(b) { return this.b; }

      getA(a) { return this.a; }

      setR(r) { this.r = r; }

      setG(g) { this.g = g; }

      setB(b) { this.b = b; }

      setA(a) { this.a = a; }
}

export default Filtro;

