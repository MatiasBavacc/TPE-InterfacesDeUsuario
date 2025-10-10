"use strict";
export class Figura {

constructor(x, y, ancho, alto, color, sprite, contexto) {
            this.x = x;
            this.y = y;
            this.ancho = ancho;
            this.alto = alto;
            this.color = color;
            this.sprite = sprite; 
            this.ctx = contexto;
            this.angulo = 0;

            this.xCorrecto = x;
            this.yCorrecto = y;
            this.anguloCorrecto = 0;
      }

      getPosX(){ return this.x; }

      getPosY(){ return this.y; }

      getAncho(){ return this.ancho; }

      getAlto(){ return this.alto; }

      getColor(){ return this.color; }

      getSprite() { return this.sprite; } 

      setPosX(x){ this.x = x; }

      setPosY(y){ this.y = y; }

      setColor(color){ this.color = color; }

      dibujarFigura() {
            this.ctx.save();
            this.ctx.fillStyle = this.getColor();
            this.ctx.strokeStyle = this.getColor();
            this.ctx.lineWidth = 4;
            this.ctx.strokeRect(-this.ancho / 2, -this.alto / 2, this.ancho, this.alto);
            this.ctx.fillRect(-this.ancho / 2, -this.alto / 2, this.ancho, this.alto);
            this.ctx.restore();
      }

      dibujarFiguraCompleta() {
            this.dibujarFigura();
            if (this.sprite) {
                  this.sprite.dibujar(this.ctx, this.ancho, this.alto);
            }
      }
      
      estaDentro(x, y) {
            return (x >= this.x && x <= this.x + this.ancho &&
                    y >= this.y && y <= this.y + this.alto);
      }
    
      rotar(grados) {
            this.angulo = this.angulo + grados; 

            this.angulo = this.angulo % 360;

            if (this.angulo < 0) {
                  this.angulo += 360;
            }
      }
    

      rotarFigura() { 
            this.ctx.save();
            
            const centroX = this.x + this.ancho / 2;
            const centroY = this.y + this.alto / 2;
            this.ctx.translate(centroX, centroY);
            this.ctx.rotate(this.angulo * Math.PI / 180);
            this.dibujarFiguraCompleta();

            this.ctx.restore();
      }

      posicionCorrecta() {
            const enAngulo = this.angulo % 360 === this.anguloCorrecto % 360;
            return enAngulo;
      }

}

export default Figura;
