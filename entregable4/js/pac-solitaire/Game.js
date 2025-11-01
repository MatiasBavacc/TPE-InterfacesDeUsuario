import { TableroController } from "./controller/Tablero.Controller.js";
import { Interfaz } from "./Interfaz.js";
export class Game {
      constructor(canvas) {
            this.canvas = canvas;
            this.tableroController = new TableroController(canvas);
            this.interfaz = new Interfaz();

            this.arrastrando = false;
            this.casilleroSeleccionado = null;
      }

      iniciar() {
            this.interfaz.mostrarPantallaInicio();
            this.iniciarJuego();
      }

      iniciarJuego() {
            this.tableroController.inicializar();

            this.canvas.addEventListener('mousedown', this.mouseDragStart.bind(this));
            this.canvas.addEventListener('mousemove', this.mouseDrag.bind(this));
            this.canvas.addEventListener('mouseup', this.mouseDragEnd.bind(this));
      }

      pausar() {
            console.log("Juego pausado");
      }

      finalizar() {
            location.href = "game.html";
      }

      mouseDragStart(event) {
            const rect = this.canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            console.log("Empezo a Arrastrar: ", x, y);
            this.arrastrando = true;
            this.casilleroSeleccionado = this.tableroController.arrastrarFicha(x, y);
            if(this.casilleroSeleccionado){
                  this.tableroController.movimientosPosibles(this.casilleroSeleccionado);
            }
      }

      mouseDrag(event) {
            if (!this.arrastrando) return;

            const rect = this.canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            console.log("Arrastrando en: ", x, y);

            if(this.casilleroSeleccionado){
                  this.casilleroSeleccionado?.getFicha().setX(x - this.casilleroSeleccionado.getAncho() / 2);
                  this.casilleroSeleccionado?.getFicha().setY(y - this.casilleroSeleccionado.getAlto() / 2);
                  this.tableroController.dibujarFondo();

                  this.tableroController.movimientosPosibles(this.casilleroSeleccionado);
                  this.casilleroSeleccionado?.getFicha().dibujar();
            }
      }

      mouseDragEnd(event) {
            const rect = this.canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            console.log("Arrastre terminado en: ", x, y);
            this.arrastrando = false;

            if(this.casilleroSeleccionado){

                  if(this.casilleroSeleccionado.getFicha() != null){
                        this.casilleroSeleccionado.getFicha().setX(this.casilleroSeleccionado.getX());
                        this.casilleroSeleccionado.getFicha().setY(this.casilleroSeleccionado.getY());
                        this.tableroController.dibujarFondo();
                        this.casilleroSeleccionado.getFicha().dibujar();
                  }
            }
      }

}

export default Game;