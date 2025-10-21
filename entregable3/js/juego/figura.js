"use strict";
export class Figura {

    constructor(x, y, ancho, alto, color, sprite, contexto, i = 0, j = 0) {
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
        
        // la figura ahora rastrea su propio estado de "ayudita"
        this.resueltaConAyuda = false;
        this.i = i; // guardo su posición en la grilla (columna)
        this.j = j; // guardo su posición en la grilla (fila)
        this.unida = false; // stado para saber si debe dibujarse sin borde
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
        
        //  dibuja el fondo PRIMERO
        this.ctx.fillRect(-this.ancho / 2, -this.alto / 2, this.ancho, this.alto);

        // dibuja el borde DESPUÉS, solo si no está unida
        if (!this.unida) {
            this.ctx.strokeStyle = this.getColor();
            this.ctx.lineWidth = 4;
            this.ctx.strokeRect(-this.ancho / 2, -this.alto / 2, this.ancho, this.alto);
        }

        this.ctx.restore();
    }

    dibujarFiguraCompleta() {
        this.dibujarFigura();
        if (this.sprite) {
            this.sprite.dibujar(this.ctx, this.ancho, this.alto);
        }
    }
    
    /* calcula si un clic (x, y) está dentro de la figura, incluso cuando está rotada.*/

    estaDentro(x, y) {
        // calcula el centro de la figura
        const centroX = this.x + this.ancho / 2;
        const centroY = this.y + this.alto / 2;
        
        // transforma las coordenadas del clic al sistema de coordenadas local de la figura (moviéndolas al origen 0,0)
        const relX = x - centroX;
        const relY = y - centroY;

        // "des-rota" las coordenadas del clic usando el ángulo negativo de la figura
        const rad = -this.angulo * Math.PI / 180;
        const cos = Math.cos(rad);
        const sin = Math.sin(rad);
        
        const unrotatedX = relX * cos - relY * sin;
        const unrotatedY = relX * sin + relY * cos;

        // ahora comprueba si el punto "des-rotado" está dentro del rectángulo centrado en el origen (que no está rotado).
        const halfAncho = this.ancho / 2;
        const halfAlto = this.alto / 2;

        return (unrotatedX >= -halfAncho && unrotatedX <= halfAncho &&
             unrotatedY >= -halfAlto  && unrotatedY <= halfAlto);
    }
    
    rotar(grados) {
        this.angulo = this.angulo + grados; 
        this.angulo = this.angulo % 360;
        if (this.angulo < 0) {
            this.angulo += 360;
        }
    }
    
    /*dibuja el tinte de "ayudita" si es necesario.*/

    rotarFigura() { 
        this.ctx.save();
        
        const centroX = this.x + this.ancho / 2;
        const centroY = this.y + this.alto / 2;
        this.ctx.translate(centroX, centroY);
        this.ctx.rotate(this.angulo * Math.PI / 180);
        
        // dibuja la figura y el sprite
        this.dibujarFiguraCompleta();

        // dibuja el tinte verde si fue resuelta con ayuda
        if (this.resueltaConAyuda) {
            this.ctx.fillStyle = 'rgba(0, 255, 0, 0.4)';
            this.ctx.fillRect(-this.ancho / 2, -this.alto / 2, this.ancho, this.alto);
        }

        this.ctx.restore();
    }

    posicionCorrecta() {
        const enAngulo = this.angulo % 360 === this.anguloCorrecto % 360;
        return enAngulo;
    }
}

export default Figura;