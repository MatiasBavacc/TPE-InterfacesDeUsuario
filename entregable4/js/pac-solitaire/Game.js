import { TableroController } from "./controller/Tablero.Controller.js";
import { Interfaz } from "./Interfaz.js";
import CuentaRegresiva from "./cuentaRegresiva.js";

export class Game {
   constructor(canvas) {
      this.canvas = canvas;
      this.tableroController = new TableroController(canvas);
      this.interfaz = new Interfaz(this);

      this.isPaused = false;
      this.timer = new CuentaRegresiva(120); // controla el tiempo

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

      this.timer.reiniciar(); // inicia el timer
      this._iniciarLoopTimer(); //  inicia el control del tiempo

      this.canvas.addEventListener('mousedown', this.boundMouseDragStart);
      this.canvas.addEventListener('mousemove', this.boundMouseDrag);
      this.canvas.addEventListener('mouseup', this.boundMouseDragEnd);
   }

   _iniciarLoopTimer() {
      this.loopTimer = setInterval(() => {
         if (this.isPaused) return;
         this.timer.mostrarTiempo();
         if (this.timer.finalizo()) {
            clearInterval(this.loopTimer);
            this.interfaz.mostrarDerrota();
            this._desactivarListenersJuego();
         }
      }, 1000);
   }

   detenerJuego() {
      console.log("Deteniendo el juego y listeners...");
      clearInterval(this.loopTimer);
      this.timer.detener();

      this.canvas.removeEventListener('mousedown', this.boundMouseDragStart);
      this.canvas.removeEventListener('mousemove', this.boundMouseDrag);
      this.canvas.removeEventListener('mouseup', this.boundMouseDragEnd);

      this.arrastrando = false;
      this.casilleroSeleccionado = null;

      this.tableroController.limpiarTablero(); 
   }

   pausar() {
      this.isPaused = true;
      this.timer.pausar();
      console.log("Juego pausado");
   }

   reanudar() {
      this.isPaused = false;
      this.timer.reanudar();
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
         this.casilleroSeleccionado?.getFicha().siendoArrastrado();
         this.casilleroSeleccionado?.getFicha().dibujar();
      }
   }

   mouseDragEnd(event) {
      if (!this.arrastrando || this.isPaused) return;
      this.arrastrando = false;

      if(this.casilleroSeleccionado?.getFicha() != null){
         this.casilleroSeleccionado?.getFicha().soltarArrastre();
      }
      
      const rect = this.canvas.getBoundingClientRect();
      const scaleX = this.canvas.width / rect.width;
      const scaleY = this.canvas.height / rect.height;
      const x = (event.clientX - rect.left) * scaleX;
      const y = (event.clientY - rect.top) * scaleY;

      let casilleroNuevo = this.tableroController.soltarArrastre(x, y);
      let movimientoExitoso = false;

      if (casilleroNuevo && this.casilleroSeleccionado) {
         if (casilleroNuevo.getFicha() == null && casilleroNuevo.getMarcado()) {
            if (this.tableroController.soltarFicha(this.casilleroSeleccionado, casilleroNuevo)) {
               movimientoExitoso = true;
            }
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

      this.desmarcarCasilleros();
      this.casilleroSeleccionado = null;

      if (movimientoExitoso) {
         this._verificarEstadoJuego();
      }
   }

   _verificarEstadoJuego() {
      const fichasRestantes = this.tableroController.contarFichasRestantes();
      const hayMovimientos = this.tableroController.hayMovimientosDisponibles();

      if (fichasRestantes === 1) {
         // ¡GANÓ!
         this._desactivarListenersJuego(); 
         
         setTimeout(() => {
            this.interfaz.mostrarVictoria();
         }, 1500);

      } else if (!hayMovimientos) {
         // ¡PERDIÓ!
         this._desactivarListenersJuego();

         setTimeout(() => {
            this.interfaz.mostrarDerrota();
         }, 1500);
      }
   }

   _desactivarListenersJuego() {
      this.canvas.removeEventListener('mousedown', this.boundMouseDragStart);
      this.canvas.removeEventListener('mousemove', this.boundMouseDrag);
      this.canvas.removeEventListener('mouseup', this.boundMouseDragEnd);
      this.arrastrando = false;
      this.casilleroSeleccionado = null;
   }

   desmarcarCasilleros() {
      this.tableroController.desmarcarCasilleros();
   }

}

export default Game;