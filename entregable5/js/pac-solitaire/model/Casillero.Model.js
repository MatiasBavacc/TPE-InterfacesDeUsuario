export class CasilleroModel {

    constructor(x, y, ancho, alto){
        this.x = x;
        this.y = y;
        this.ancho = ancho;
        this.alto = alto;
    }

    estaDentro(x, y) {
        return (
        x >= this.x &&
        x <= this.x + this.ancho &&
        y >= this.y &&
        y <= this.y + this.alto
        );
    }

    



}
export default CasilleroModel;