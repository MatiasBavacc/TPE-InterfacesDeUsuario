import { TableroController } from "./controller/Tablero.Controller.js";
import { Interfaz } from "./Interfaz.js";
export class Game {
      constructor(canvas) {
            this.canvas = canvas;
            this.tableroController = new TableroController(canvas);
            this.interfaz = new Interfaz(this);

            this.isPaused = false;

            this.arrastrando = false;
            this.casilleroSeleccionado = null;

            this.boundMouseDragStart = this.mouseDragStart.bind(this);
            this.boundMouseDrag = this.mouseDrag.bind(this);
            this.boundMouseDragEnd = this.mouseDragEnd.bind(this);
      }

      iniciar() {
            this.interfaz.mostrarPantallaInicio();
      }

      iniciarJuego() {
            this.tableroController.inicializar();

            this.tableroController.dibujarFondo();

            this.canvas.addEventListener('mousedown', this.boundMouseDragStart);
            this.canvas.addEventListener('mousemove', this.boundMouseDrag);
            this.canvas.addEventListener('mouseup', this.boundMouseDragEnd);
      }

      detenerJuego() {
        console.log("Deteniendo el juego y listeners...");
        
        this.canvas.removeEventListener('mousedown', this.boundMouseDragStart);
        this.canvas.removeEventListener('mousemove', this.boundMouseDrag);
        this.canvas.removeEventListener('mouseup', this.boundMouseDragEnd);

        this.arrastrando = false;
        this.casilleroSeleccionado = null;

        this.tableroController.limpiarTablero(); 
      }

      pausar() {
            this.isPaused = true;
            console.log("Juego pausado");
      }

      reanudar() {
        this.isPaused = false;
        console.log("Juego reanudado");
      }

      finalizar() {
            location.href = "game.html";
      }

      mouseDragStart(event) {
            if (this.isPaused) return;
            const rect = this.canvas.getBoundingClientRect();
            const scaleX = this.canvas.width / rect.width;
            const scaleY = this.canvas.height / rect.height;
            const x = (event.clientX - rect.left) * scaleX;
            const y = (event.clientY - rect.top) * scaleY;
            /* console.log("Empezo a Arrastrar: ", x, y); */
            this.arrastrando = true;
            this.casilleroSeleccionado = this.tableroController.arrastrarFicha(x, y);
            if(this.casilleroSeleccionado){
                  this.tableroController.movimientosPosibles(this.casilleroSeleccionado);
            }
      }

      mouseDrag(event) {
            if (!this.arrastrando || this.isPaused) return;

            const rect = this.canvas.getBoundingClientRect();
            const scaleX = this.canvas.width / rect.width;
            const scaleY = this.canvas.height / rect.height;
            const x = (event.clientX - rect.left) * scaleX;
            const y = (event.clientY - rect.top) * scaleY;

            /* console.log("Arrastrando en: ", x, y); */

            if(this.casilleroSeleccionado){
                  this.casilleroSeleccionado?.getFicha().setX(x - this.casilleroSeleccionado.getAncho() / 2);
                  this.casilleroSeleccionado?.getFicha().setY(y - this.casilleroSeleccionado.getAlto() / 2);
                  this.tableroController.dibujarFondo();

                  this.tableroController.movimientosPosibles(this.casilleroSeleccionado);
                  /* this.casilleroSeleccionado?.getFicha().siendoArrastrado();  ACA PASA LO MISMO SE ESTA ROMPIENDO, CASI ANDA*/
                  this.casilleroSeleccionado?.getFicha().dibujar();
            }
      }

      mouseDragEnd(event) {
            if (!this.arrastrando || this.isPaused) return;
            this.arrastrando = false;
            
            const rect = this.canvas.getBoundingClientRect();
            const scaleX = this.canvas.width / rect.width;
            const scaleY = this.canvas.height / rect.height;
            const x = (event.clientX - rect.left) * scaleX;
            const y = (event.clientY - rect.top) * scaleY;

            let casilleroNuevo = this.tableroController.soltarArrastre(x, y);

            if (casilleroNuevo && this.casilleroSeleccionado) {
                  if (casilleroNuevo.getFicha() == null && casilleroNuevo.getMarcado()) {
                  this.tableroController.soltarFicha(this.casilleroSeleccionado, casilleroNuevo);
                  this.tableroController.dibujarFondo();
                  }
            }

            if (this.casilleroSeleccionado) {
                  if (this.casilleroSeleccionado.getFicha() != null) {
                  this.casilleroSeleccionado.getFicha().setX(this.casilleroSeleccionado.getX());
                  this.casilleroSeleccionado.getFicha().setY(this.casilleroSeleccionado.getY());
                  this.tableroController.dibujarFondo();
                  this.casilleroSeleccionado.getFicha().dibujar();
                  } else if (casilleroNuevo && casilleroNuevo.getFicha()) {
                  casilleroNuevo.getFicha().setX(casilleroNuevo.getX());
                  casilleroNuevo.getFicha().setY(casilleroNuevo.getY());
                  this.tableroController.dibujarFondo();
                  casilleroNuevo.getFicha().dibujar();
                  }
            }
            /* if(this.casilleroSeleccionado?.getFicha() != null){
                  this.casilleroSeleccionado?.getFicha().soltarArrastre();                                     ESTO SE ESTA ROMPIENDO, CASI ANDA
            } */

            this.desmarcarCasilleros();
            this.casilleroSeleccionado = null;
      }

      desmarcarCasilleros() {
            this.tableroController.desmarcarCasilleros();
      }

}

export default Game;