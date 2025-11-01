export class FichaView {

    constructor() {
        this.radius = 20;
        this.color = '#FFFF00';
        this.colorResaltado = '#ff7b00ff';
    }

    // ficha normal, llama a ficha model para ver si está seleccionada
    dibujarFicha(ctx, x, y, model) {
        ctx.beginPath();
        ctx.arc(x, y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();

        // ficha resaltada, revisa en model si está seleccionada
        if (model.seleccionada) {
            ctx.beginPath();
            ctx.arc(x, y, this.radius + 4, 0, Math.PI * 2);
            ctx.strokeStyle = this.colorResaltado;
            ctx.lineWidth = 3;
            ctx.stroke();
            ctx.closePath();
        }
    }

}

export default FichaView;