import { FichaModel } from "../model/Ficha.Model.js";
import { FichaView } from "../view/Ficha.View.js";

export class FichaController {

    constructor(ctx, x, y, ancho, alto) {
        this.model = new FichaModel();
        this.view = new FichaView();
        /** @type { CanvasRenderingContext2D } */
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.ancho = ancho;
        this.alto = alto;
        this.image = new Image();

        this.random = Math.floor(Math.random() * 4) + 1;
        
        this.image.src = this.cargarImagen();
        this.image.onload = () => {
            this.dibujarImagen();
        };

        this.EstaAlMedio = false;
        this.siendoArrastrado1 = false;
        
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
        /* this.view.dibujarFicha(this.ctx, x, y, this.model); */
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

    estaEnELMedio(){
        if(!this.EstaAlMedio){
            this.EstaAlMedio = true;
            this.cambiarImagen();
        }
    }

    dibujarImagen() {
        this.ctx.save();
        this.ctx.drawImage(this.image, this.x +5, this.y - 10, this.image.width * 0.15, this.image.height * 0.15);
        this.ctx.restore();
    }

    cargarImagen() {
        switch(this.random){
            case 1:
                return './resourses/images/pac-solitaire/blinky.png';
            case 2:
                return './resourses/images/pac-solitaire/pinky.png';
            case 3:
                return './resourses/images/pac-solitaire/inky.png';
            case 4:
                return './resourses/images/pac-solitaire/clyde.png';
        }
    }

    cambiarImagen() {
        const nuevaImagen = new Image();

        switch(this.random){
            case 1:
                nuevaImagen.src = './resourses/images/pac-solitaire/blinkyAzul.png';
                break;
            case 2:
                nuevaImagen.src = './resourses/images/pac-solitaire/pinkyAzul.png';
                break;
            case 3:
                nuevaImagen.src = './resourses/images/pac-solitaire/inkyAzul.png';
                break;
            case 4:
                nuevaImagen.src = './resourses/images/pac-solitaire/clydeAzul.png';
                break;
        }

        nuevaImagen.onload = () => {
            this.image = nuevaImagen;
            this.dibujarImagen();
        };
    }

    volverImagenOriginal() {
        if(this.EstaAlMedio){
            this.EstaAlMedio = false;

            this.image.src = this.cargarImagen();
            this.image.onload = () => {
                this.dibujarImagen();
            }
        }
    }

    siendoArrastrado() {
        if(!this.siendoArrastrado1){
            this.siendoArrastrado1 = true;
            this.imagenArrastrado();
        }
    }

    imagenArrastrado() {
        const nuevaImagen = new Image();

        nuevaImagen.src = './resourses/images/pac-solitaire/pacman.png';

        nuevaImagen.onload = () => {
            this.image = nuevaImagen;
            this.dibujarImagen();
        };

    }

    soltarArrastre() {
    if(this.siendoArrastrado1){
        this.siendoArrastrado1 = false;

        if(this.EstaAlMedio){
            // Si estaba al medio, mostrar imagen azul
            this.cambiarImagen();
        } else {
            // Si no estaba al medio, volver a imagen original
            this.image.src = this.cargarImagen();
            this.image.onload = () => { this.dibujarImagen(); }
        }
    }
}

}

export default FichaController;