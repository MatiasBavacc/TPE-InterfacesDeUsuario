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
        this.anguloActual = 0; // ángulo que se usa para dibujar (cambia gradualmente)
        this.targetAngulo = 0; // ángulo al que queremos llegar
        this.velocidadRotacion = 0.10;

        this.xCorrecto = x;
        this.yCorrecto = y;
        this.anguloCorrecto = 0;

        this.resueltaConAyuda = false; // para saber si se pinta de verde o no (ayudita)
        this.i = i; // guardo su posición en la grilla (columna)
        this.j = j; // guardo su posición en la grilla (fila)
        //las dos anteriores para usar la animacion de victoria
        this.unida = false; // estado para saber si debe dibujar su borde o no (usado en la animacion de victoria)
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

    dibujarFiguraCompleta() { //llama a dibujarFigura y despues dibuja la imagen (this.sprite.dibujar) encima del fondo
        this.dibujarFigura();
        if (this.sprite) {
            this.sprite.dibujar(this.ctx, this.ancho, this.alto);
        }
    }
    
    /* calcula si un click (x, y) está dentro de la figura, incluso cuando está rotada.*/

    estaDentro(x, y) {
        // calcula el centro de la figura
        const centroX = this.x + this.ancho / 2;
        const centroY = this.y + this.alto / 2;
        
        // transforma las coordenadas del click al sistema de coordenadas local de la figura (moviéndolas al origen 0,0)
        const relX = x - centroX;
        const relY = y - centroY;

        // "des-rota" las coordenadas del click usando el ángulo negativo de la figura
        const rad = -this.anguloActual * Math.PI / 180;
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
    
    //inicia la animacion hacia un nuevo angulo
    iniciarRotacion(grados) {
        // calcula el nuevo ángulo objetivo sumando los grados al ángulo objetivo ACTUAL
        this.targetAngulo += grados;
        // normaliza el ángulo objetivo para que esté entre 0 y 359
        this.targetAngulo = (this.targetAngulo % 360 + 360) % 360;
    }

    //actualiza el ángulo visual (anguloActual) acercándolo al ángulo objetivo (targetAngulo)
    updateAnimation() {
        // salcula la diferencia de ángulo, tomando el camino más corto (importante para 270 -> 0)
        let diff = this.targetAngulo - this.anguloActual;
        while (diff <= -180) diff += 360;
        while (diff > 180) diff -= 360;

        // si la diferencia es muy chica, ajusta al valor final
        if (Math.abs(diff) < 0.1) {
            this.anguloActual = this.targetAngulo;
        } else {
            // hace el lerp hacia el ángulo objetivo
            this.anguloActual += diff * this.velocidadRotacion;
            // normaliza el ángulo actual también
            this.anguloActual = (this.anguloActual % 360 + 360) % 360;
        }
    }
    
    /*dibuja el tinte de "ayudita" si es necesario.*/

    rotarFigura() { //dibujar con rotacion
        this.ctx.save(); //guarda el estado (que no esta rotado)
        
        const centroX = this.x + this.ancho / 2;
        const centroY = this.y + this.alto / 2;
        this.ctx.translate(centroX, centroY); //mueve el "punto 0,0" del lienzo al centro de la figura
        // ssa anguloActual para la rotación visual
        this.ctx.rotate(this.anguloActual * Math.PI / 180); //rota todo el lienzo alrededor de ese nuevo punto 0,0
        
        // dibuja la figura y el sprite
        this.dibujarFiguraCompleta();

        // dibuja el tinte verde si fue resuelta con ayuda
        if (this.resueltaConAyuda) {
            this.ctx.fillStyle = 'rgba(0, 255, 0, 0.4)';
            this.ctx.fillRect(-this.ancho / 2, -this.alto / 2, this.ancho, this.alto);
        }

        this.ctx.restore();
    }

    posicionCorrecta() { //comprobacion de victoria para la pieza
        const enAngulo = Math.abs(this.anguloActual - this.anguloCorrecto) < 0.1 || Math.abs(this.anguloActual - this.anguloCorrecto - 360) < 0.1 || Math.abs(this.anguloActual - this.anguloCorrecto + 360) < 0.1;
        return enAngulo;
    }
}

export default Figura;