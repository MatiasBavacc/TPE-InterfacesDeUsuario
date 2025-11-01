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

      dibujarCasilla(ctx, color = "") {
        ctx.save();

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
        return (
        x >= this.x &&
        x <= this.x + this.ancho &&
        y >= this.y &&
        y <= this.y + this.alto
        );
    }

    eliminarficha(ctx){
      this.ficha = null;
      this.dibujarCasilla(ctx);
    }

}
export default CasilleroController;