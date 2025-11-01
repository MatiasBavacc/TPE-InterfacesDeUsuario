export class FichaModel {

    constructor() {
        // el unico estado que le importa a la ficha es si está seleccionada actualmente por el jugador
        this.seleccionada = false;
    }

    // marca la ficha como seleccionada
    seleccionarFicha() {
        this.seleccionada = true;
    }

    // marca la ficha como no seleccionada
    deseleccionarFicha() {
        this.seleccionada = false;
    }
}

export default FichaModel;