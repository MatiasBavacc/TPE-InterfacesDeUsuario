import { TableroModel } from '../model/Tablero.Model.js';
import { TableroView } from '../view/Tablero.View.js';
import CasilleroController from './Casillero.Controller.js';
import { FichaController } from './Ficha.Controller.js';

export class TableroController {
      /* constructor(canvas) {
            this.model = new TableroModel();
            this.view = new TableroView(canvas);
      }

      iniciar() {
            this.dibujarTablero();
      }

      dibujarTablero() {
            const casilleros = this.model.obtenerCasilleros();
            this.view.dibujarTablero(casilleros);
      } */

      constructor(canvas) {
            this.casilleros = [];
            /** @type { HTMLCanvasElement} */
            this.canvas = canvas;
            /** @type { CanvasRenderingContext2D } */
            this.ctx = canvas.getContext('2d');
            this.casilleroSize = 60;
            this.fondo = new Image();
            this.fondo.src = 'resourses/images/pac-solitaire/fondo-tablero.png';
            this.fondo.onload = () => {
                  this.dibujarFondo();
            }

      }

      inicializar() {
            const layout = [
                  [-1, -1, 1, 1, 1, -1, -1],
                  [-1, -1, 1, 1, 1, -1, -1],
                  [ 1,  1, 1, 1, 1,  1,  1],
                  [ 1,  1, 1, 0, 1,  1,  1],
                  [ 1,  1, 1, 1, 1,  1,  1],
                  [-1, -1, 1, 1, 1, -1, -1],
                  [-1, -1, 1, 1, 1, -1, -1]
            ];
            const espacio = 30;
            const offsetX = 400;
            const offsetY = 100;

            for (let y = 0; y < layout.length; y++) {
                  for (let x = 0; x < layout[y].length; x++) {
                        if (layout[y][x] !== -1) {
                              const ficha = layout[y][x] === 1 ? new FichaController(this.ctx,
                                    x * (this.casilleroSize + espacio) + offsetX,
                                    y * (this.casilleroSize + espacio) + offsetY,
                                    this.casilleroSize,
                                    this.casilleroSize
                              ) : null;
                              this.casilleros.push(
                                    new CasilleroController(
                                          x * (this.casilleroSize + espacio) + offsetX,
                                          y * (this.casilleroSize + espacio) + offsetY,
                                          this.casilleroSize,
                                          this.casilleroSize,
                                          ficha,
                                          this.ctx
                                    )
                              );
                        }
                  }
            }
      }

      dibujarMarcoTablero(ctx, x, y, ancho, alto, radio = 20) {
            // Fondo negro
            ctx.fillStyle = "#000000"; // relleno negro
            ctx.beginPath();
            ctx.moveTo(x + radio, y);
            ctx.lineTo(x + ancho - radio, y);
            ctx.quadraticCurveTo(x + ancho, y, x + ancho, y + radio);
            ctx.lineTo(x + ancho, y + alto - radio);
            ctx.quadraticCurveTo(x + ancho, y + alto, x + ancho - radio, y + alto);
            ctx.lineTo(x + radio, y + alto);
            ctx.quadraticCurveTo(x, y + alto, x, y + alto - radio);
            ctx.lineTo(x, y + radio);
            ctx.quadraticCurveTo(x, y, x + radio, y);
            ctx.closePath();
            ctx.fill();

            // Borde amarillo brillante
            ctx.strokeStyle = "#FFD700"; // amarillo dorado
            ctx.lineWidth = 6;
            ctx.shadowBlur = 15;
            ctx.shadowColor = "#FFD700";
            ctx.stroke();

            // Quitar sombra para lo siguiente
            ctx.shadowBlur = 0;
      }


      dibujarTablero() {
            this.ctx.save();
            const totalSize = 7 * (this.casilleroSize + 30);
            this.dibujarMarcoTablero(this.ctx, 400 - 40, 100 - 40, totalSize + 80, totalSize + 80);
            for (let c of this.casilleros) {
                  c.dibujarCasilla(this.ctx, "yellow");
            }
            this.ctx.restore();
      }

      dibujarFondo(){
            this.ctx.save();

            this.ctx.drawImage(this.fondo, 0, 0, this.canvas.width, this.canvas.height);

            this.ctx.restore();
            this.dibujarTablero();
      }

      arrastrarFicha(x, y) {
            for (let c of this.casilleros) {
                  if (c.estaDentro(x, y) && c.ficha != null) {
                        return c;
                  }
            }
            return null;
      }
}

export default TableroController;