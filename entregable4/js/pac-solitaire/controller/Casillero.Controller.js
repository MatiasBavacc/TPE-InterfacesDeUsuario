import { CasilleroModel } from "../model/Casillero.Model.js";
import { CasilleroView } from "../view/Casillero.View.js";

export class CasilleroController {
  constructor(x, y, ancho, alto, ficha, ctx){
    this.model = new CasilleroModel();
    this.view = new CasilleroView();
    this.ficha = ficha;
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.ancho = ancho;
    this.alto = alto;
  }

  getX() {
    return this.x;
  }

  getY() {
    return this.y;
  }

  getAncho() {
    return this.ancho;
  }

  getAlto() {
    return this.alto;
  }

  setX(x) {
    this.x = x;
  }

  setY(y) {
    this.y = y;
  }

  getFicha() {
    if (this.ficha == null) {
      return null;
    }
    return this.ficha;
  }

  setFicha(ficha) {
    this.ficha = ficha;
  }

  dibujarCasilla(ctx, color = "") {
    ctx.save();
    ctx.clearRect(this.x - 2, this.y - 2, this.ancho + 4, this.alto + 4);

    ctx.beginPath();
    ctx.ellipse(
      this.x + this.ancho / 2,  // centro X
      this.y + this.alto / 2,   // centro Y
      this.ancho / 2,           // radioX
      this.alto / 2,            // radioY
      0,                        // rotación
      0,                        // ángulo inicio
      2 * Math.PI               // ángulo fin
    );
    ctx.strokeStyle = color;
    ctx.lineWidth = 4;
    ctx.stroke();

    if (this.ficha != null) {
      this.ficha.dibujar(this.ctx, this.x, this.y);
    }

    ctx.restore();
  }

  marcarCasilla(ctx) {
    this.dibujarCasilla(ctx, "green");
  }

  estaDentro(x, y) {
    const centroX = this.x + this.ancho / 2;
    const centroY = this.y + this.alto / 2;
    const dx = x - centroX;
    const dy = y - centroY;
    return Math.sqrt(dx * dx + dy * dy) <= this.ancho / 2;
  }

  eliminarficha(ctx){
    this.ficha = null;
    this.dibujarCasilla(ctx);
  }

}
export default CasilleroController;