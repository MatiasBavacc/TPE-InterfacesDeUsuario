export class TableroView {
      constructor(canvas) {
            /** @type { HTMLCanvasElement} */
            this.canvas = canvas;
            /** @type { CanvasRenderingContext2D } */
            this.ctx = canvas.getContext('2d');
            this.casilleroSize = 60;
            this.fondo = new Image();
            this.fondo.src = 'resourses/images/pac-solitaire/fondo-tablero.png';
            this.fondo.onload = () => {
                  this.dibujarFondo();
            }
      }


      dibujarTablero(casilleros) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            for (let c of casilleros) {
                  c.draw(this.ctx, this.casilleroSize);
            }
      }

      dibujarFondo(){
            this.ctx.drawImage(this.fondo, 0, 0, this.canvas.width, this.canvas.height);
      }

}
export default TableroView;