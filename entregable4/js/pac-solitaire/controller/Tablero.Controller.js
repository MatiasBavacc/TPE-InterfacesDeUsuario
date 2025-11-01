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


      dibujarTablero() {
            this.ctx.save();
            for (let c of this.casilleros) {
                  c.dibujarCasilla(this.ctx, "red");
            }
            this.ctx.restore();
      }

      dibujarFondo(){
            this.ctx.save();

            this.ctx.drawImage(this.fondo, 0, 0, this.canvas.width, this.canvas.height);

            this.ctx.restore();
            this.dibujarTablero();
      }
}

export default TableroController;