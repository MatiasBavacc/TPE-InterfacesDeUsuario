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


    this.animacionActiva = false;  // si está animando o no
    this.alpha = 0.3;              // transparencia inicial
    this.incremento = 0.05;        // velocidad del pulso
    this.imagenPacman = new Image();
    this.imagenPacman.src = "resourses/images/pac-solitaire/pacman.png";
    this._animFrame = null;        // id de requestAnimationFrame
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


  iniciarAnimacionPacmanVerde() {
    if (this.animacionActiva) return;
    this.animacionActiva = true;
    this.alpha = 0.3;
    this.incremento = 0.05;

    // bucle de animación suave con requestAnimationFrame
    const animar = () => {
      if (!this.animacionActiva) return;

      this.ctx.save();

      if (this.ficha != null) {
        this.ficha.dibujar(this.ctx, this.x, this.y);
      }

      if (this.imagenPacman.complete) {
        this.ctx.globalAlpha = this.alpha * 1.5;
        this.ctx.drawImage(
          this.imagenPacman,
          this.x + this.ancho / 2 - this.ancho / 2,
          this.y + this.alto / 2 - this.alto / 2,
          this.ancho ,
          this.alto
        );
      }

      this.ctx.restore();

      // invertir dirección del brillo (sube/baja opacidad)
      this.alpha += this.incremento;
      if (this.alpha >= 0.7 || this.alpha <= 0.3) {
        this.incremento *= -1;
      }

      this._animFrame = requestAnimationFrame(animar);
    };

    animar();
  }

  detenerAnimacionPacmanVerde() {
    if (!this.animacionActiva) return;
    this.animacionActiva = false;
    cancelAnimationFrame(this._animFrame);

    // Limpia y redibuja el casillero normalmente
    this.ctx.save();
    /* this.ctx.clearRect(this.x - 2, this.y - 2, this.ancho + 4, this.alto + 4); */
    this.dibujarCasilla(this.ctx);
    this.ctx.restore();
  }

}
export default CasilleroController;