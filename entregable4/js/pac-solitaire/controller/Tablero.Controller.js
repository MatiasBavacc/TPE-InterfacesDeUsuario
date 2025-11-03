import { TableroModel } from '../model/Tablero.Model.js';
import { TableroView } from '../view/Tablero.View.js';
import CasilleroController from './Casillero.Controller.js';
import { FichaController } from './Ficha.Controller.js';

export class TableroController {
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

      soltarArrastre(x,y){
            for (let c of this.casilleros) {
                  if (c.estaDentro(x, y)) {
                        return c;
                  }
            }
      }

      /**
       * Intenta soltar la ficha desde casilleroActual en casilleroDestino.
       * Si el movimiento es un salto válido (ortogonal, 2 casilleros),
       * elimina la ficha intermedia y realiza el movimiento.
       * Devuelve true si el movimiento fue aplicado, false en caso contrario.
       */
      soltarFicha(casilleroActual, casilleroDestino) {
            if (!casilleroActual || !casilleroDestino) return false;

            // posiciones en píxeles
            const sx = casilleroActual.getX();
            const sy = casilleroActual.getY();
            const tx = casilleroDestino.getX();
            const ty = casilleroDestino.getY();

            // distancias según tu layout: tamaño casillero + 30 (espacio)
            const distanciaMedia = this.casilleroSize + 30;
            const distancia = distanciaMedia * 2;

            const dx = tx - sx;
            const dy = ty - sy;

            // debe ser un salto ortogonal de 2 casilleros
            const esSaltoValido = ((Math.abs(dx) === distancia && dy === 0) ||
                                   (Math.abs(dy) === distancia && dx === 0));
            if (!esSaltoValido) {
                  return false;
            }

            // comprobar origen tiene ficha y destino está vacío
            const fichaOrigen = casilleroActual.getFicha();
            if (!fichaOrigen) return false;
            if (casilleroDestino.getFicha() != null) return false;

            // calcular casillero medio
            const midX = sx + dx / 2;
            const midY = sy + dy / 2;
            const casilleroMedio = this.casilleros.find(m => m.getX() === midX && m.getY() === midY);

            if (!casilleroMedio) return false;
            if (casilleroMedio.getFicha() == null) return false;

            // ejecutar movimiento: origen -> destino, y eliminar la ficha intermedia
            casilleroDestino.setFicha(fichaOrigen);
            casilleroActual.setFicha(null);
            casilleroMedio.setFicha(null);

            return true;
      }


      movimientosPosibles(casilleroActual) {
            /* console.log("Movimientos posibles para casillero en: ", casilleroActual.getX(), casilleroActual.getY()); */
            const posX = casilleroActual.getX();
            const posY = casilleroActual.getY();
            const distanciaMedia = this.casilleroSize + 30;
            const distancia = distanciaMedia * 2;

            for (let c of this.casilleros) {
                  const dx = c.getX() - posX;
                  const dy = c.getY() - posY;

                  if ((Math.abs(dx) === distancia && dy === 0) || (Math.abs(dy) === distancia && dx === 0)) {
                        const midX = posX + dx / 2;
                        const midY = posY + dy / 2;

                        const casilleroMedio = this.casilleros.find(m => m.getX() === midX && m.getY() === midY);

                        if (casilleroMedio && casilleroMedio.getFicha() != null && c.getFicha() == null) {
                              c.marcarCasilla(this.ctx);
                              casilleroMedio.getFicha().estaEnELMedio();
                        }
                  }
            }
      }

      desmarcarCasilleros() {
            for (let c of this.casilleros) {
                  c.desmarcarCasilla();
                  c.getFicha()?.volverImagenOriginal();
            }
      }

      /**
       * Verifica si queda al menos un movimiento posible en todo el tablero.
       * Devuelve true si hay al menos uno, false si el juego terminó.
       */
      hayMovimientosDisponibles() {
            const distanciaMedia = this.casilleroSize + 30;
            const distancia = distanciaMedia * 2;

            for (let origen of this.casilleros) {
                  const ficha = origen.getFicha();
                  if (!ficha) continue; // no hay ficha, no puede moverse

                  const posX = origen.getX();
                  const posY = origen.getY();

                  // posibles direcciones (dx, dy)
                  const direcciones = [
                        { dx: distancia, dy: 0 },   // derecha
                        { dx: -distancia, dy: 0 },  // izquierda
                        { dx: 0, dy: distancia },   // abajo
                        { dx: 0, dy: -distancia }   // arriba
                  ];

                  for (let dir of direcciones) {
                        const midX = posX + dir.dx / 2;
                        const midY = posY + dir.dy / 2;
                        const destX = posX + dir.dx;
                        const destY = posY + dir.dy;

                        const casilleroMedio = this.casilleros.find(c => c.getX() === midX && c.getY() === midY);
                        const casilleroDestino = this.casilleros.find(c => c.getX() === destX && c.getY() === destY);

                        // Si ambos existen y cumplen la regla: medio ocupado, destino vacío
                        if (casilleroMedio && casilleroDestino &&
                            casilleroMedio.getFicha() != null &&
                            casilleroDestino.getFicha() == null) {
                              return true; // hay al menos un movimiento posible
                        }
                  }
            }

            return false; // no se encontró ningún movimiento
      }

      limpiarTablero() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      }

}

export default TableroController;