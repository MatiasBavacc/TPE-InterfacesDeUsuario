export class CasilleroView {

    constructor(x, y){
        this.x = x;
        this.y = y;
    }

    dibujarCasilla(ctx, color = "", sitrue) {
        ctx.beginPath();
        ctx.ellipse(
        this.x + this.ancho / 2,  // centro X
        this.y + this.alto / 2,   // centro Y
        this.ancho / 2,           // radioX
        this.alto / 2,            // radioY
        0,                        // rotación
        0,                        // ángulo inicio
        2 * Math.PI               // ángulo fin
        );
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.stroke();

        if (sitrue) {
            
        }
        }

    marcarCasilla(ctx) {
            this.dibujarCasilla(ctx, "green");
    }


}
export default CasilleroView;