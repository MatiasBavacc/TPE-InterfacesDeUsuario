import { FichaModel } from "../model/Ficha.Model.js";
import { FichaView } from "../view/Ficha.View.js";

export class FichaController {

    constructor(ctx, x, y, ancho, alto) {
        this.model = new FichaModel();
        this.view = new FichaView();

        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.ancho = ancho;
        this.alto = alto;
        this.image = new Image();
        /* this.image.src = `resourses/images/pac-solitaire/fantasma${Math.floor(Math.random() * 7) + 1}.png`; */
    }

    setX(x) {
        this.x = x;
    }

    setY(y) {
        this.y = y;
    }

    getAncho() {
        return this.ancho;
    }

    getAlto() {
        return this.alto;
    }

    getX() {
        return this.x;
    }

    getY() {
        return this.y;
    }

    dibujar() {
        const y = this.y + (this.alto / 2);
        const x = this.x + (this.ancho / 2);
        this.view.dibujarFicha(this.ctx, x, y, this.model);
        this.dibujarImagen();
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

    dibujarImagen() {
        this.ctx.save();
        this.ctx.drawImage(this.image, this.x, this.y - 10, this.image.width * 0.015, this.image.height * 0.015);
        this.ctx.restore();
    }
}

export default FichaController;