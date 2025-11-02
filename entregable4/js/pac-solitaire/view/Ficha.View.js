export class FichaView {

    constructor() {
    }

    // ficha normal, llama a ficha model para ver si está seleccionada
    dibujarFicha(ctx, x, y, model) {
        ctx.beginPath();
        ctx.arc(x, y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();

        // ficha resaltada, revisa en model si está seleccionada
        if (model.seleccionada) {
            ctx.beginPath();
            ctx.arc(x, y, this.radius + 4, 0, Math.PI * 2);
            ctx.lineWidth = 3;
            ctx.stroke();
            ctx.closePath();
        }
    }

}

export default FichaView;