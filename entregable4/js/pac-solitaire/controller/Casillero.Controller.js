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
    this.marcada = false;
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

  getMarcado() {
    return this.marcada;
  }

  setFicha(ficha) {
    this.ficha = ficha;
  }

  dibujarCasilla(ctx, color = "") {
    ctx.save();

    if (this.ficha != null) {
      this.ficha.dibujar(this.ctx, this.x, this.y);
    }


    ctx.restore();
  }

  marcarCasilla(ctx) {
    this.dibujarCasilla(ctx, "green");
    this.marcada = true;
  }

  desmarcarCasilla() {
    this.marcada = false;
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