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
      }

      getPosX(){ return this.x; }

      getPosY(){ return this.y; }

      getAncho(){ return this.ancho; }

      getAlto(){ return this.alto; }

      getColor(){ return this.color; }

      getSprite() { return this.sprite; } // Devuelve la instancia de Imagen

      setPosX(x){ this.x = x; }

      setPosY(y){ this.y = y; }

      setColor(color){ this.color = color; }

      dibujarFigura() {
            this.ctx.save();
            this.ctx.fillStyle = this.getColor();
            this.ctx.strokeStyle = this.getColor();
            this.ctx.lineWidth = 4;
            this.ctx.strokeRect(this.getPosX(), this.getPosY(), this.getAncho(), this.getAlto());
            this.ctx.fillRect(this.getPosX(), this.getPosY(), this.getAncho(), this.getAlto());
            this.ctx.restore();
      }

      dibujarImagen() {
            // Delega el dibujo al objeto Imagen
            if (!this.sprite) return; 
            this.sprite.dibujar(
                  this.ctx, 
                  this.getPosX(), 
                  this.getPosY(), 
                  this.getAncho(), 
                  this.getAlto()
            );
      }

      dibujarFiguraCompleta() {
            this.dibujarFigura();
            this.dibujarImagen();
      }
      
      estaDentro(x, y) {
            // Simple verificación de rectángulo (funciona bien si la figura no está rotada)
            return (x >= this.x && x <= this.x + this.ancho &&
                  y >= this.y && y <= this.y + this.alto);
      }
    
      rotar(grados) {
            // 1. Suma/resta los grados al ángulo actual
            this.angulo = this.angulo + grados; 

            // 2. Aplica el módulo 360 para mantenerlo dentro del rango [0, 359]
            this.angulo = this.angulo % 360;

            // 3. Normaliza a positivo (maneja ángulos negativos resultantes del módulo, e.g., -90 a 270)
            if (this.angulo < 0) {
                  this.angulo += 360;
            }
      }
    
      // D. Modificar rotarFigura para que use this.angulo
      rotarFigura() { // Ya no necesita el argumento angulo, usa this.angulo
            this.ctx.save();
            
            const centroX = this.x + this.ancho / 2;
            const centroY = this.y + this.alto / 2;
            this.ctx.translate(centroX, centroY);
            // Usa this.angulo
            this.ctx.rotate(this.angulo * Math.PI / 180); // <<< USAR this.angulo

            // ... el resto del código de rotarFigura es igual
            // Dibujar la forma base (centrada en (0,0))
            this.ctx.fillStyle = this.getColor();
            this.ctx.fillRect(-this.ancho / 2, -this.alto / 2, this.ancho, this.alto);

            // Dibujar la imagen/sprite (centrada en (0,0))
            if (this.sprite && this.sprite.getImagen().complete) {
                  this.ctx.drawImage(
                  this.sprite.getImagen(),
                  this.sprite.getEjeXinicial(), this.sprite.getEjeYinicial(), this.sprite.getAnchoRecorte(), this.sprite.getAltoRecorte(), // recorte
                  -this.ancho / 2, -this.alto / 2, this.ancho, this.alto // destino centrado
                  );
            }

            this.ctx.restore();
      }

}

export default Figura;
