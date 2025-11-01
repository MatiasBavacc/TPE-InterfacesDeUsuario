import { FichaModel } from "../model/Ficha.Model.js";
import { FichaView } from "../view/Ficha.View.js";

export class FichaController {

    constructor(/* tableroController, casillero */ ctx, x, y, ancho, alto) {
        this.model = new FichaModel();
        this.view = new FichaView();

        /* this.tableroController = tableroController;
        this.casillero = casillero; // para saber la posición */
        
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.ancho = ancho;
        this.alto = alto;
    }

    /* dibujar() {

      const ctx = this.casillero.ctx;
      const x = this.casillero.x + (this.casillero.ancho / 2);
      const y = this.casillero.y + (this.casillero.alto / 2);

      this.view.dibujarFicha(ctx, x, y, this.model);
    } */

    dibujar(ctx, x, y) {
        y = y + (this.alto / 2);
        x = x + (this.ancho / 2);
        this.view.dibujarFicha(ctx, x, y, this.model);
    }

    clickeada() {
        // lógica de enviar posicion a tablero
        this.tableroController.fichaClickeada(this);
    }

    //el TableroController llama a esto para decirle que se seleccione
    seleccionar() {
        this.model.seleccionarFicha();
    }

    //el TableroController llama a esto para decirle que se deseleccione
    deseleccionar() {
        this.model.deseleccionarFicha();
    }

    getPosition() {
        // asumiendo que CasilleroController tiene una funcion getPosition()
        return this.casillero.getPosition(); 
    }

    estaSeleccionada() {
        return this.model.seleccionada;
    }
}

export default FichaController;