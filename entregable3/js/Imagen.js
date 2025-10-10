class Imagen {
      constructor(src, ejeXinicial, ejeYinicial, anchoRecorte, altoRecorte) {
            this.image = new Image();
            this.image.src = src;
            this.ejeXinicial = ejeXinicial;
            this.ejeYinicial = ejeYinicial;
            this.anchoRecorte = anchoRecorte;
            this.altoRecorte = altoRecorte;
      }

      getImagen() { return this.image; }

      getEjeXinicial() { return this.ejeXinicial; }

      getEjeYinicial() { return this.ejeYinicial; }

      getAnchoRecorte() { return this.anchoRecorte; }

      getAltoRecorte() { return this.altoRecorte; }
      
      dibujar(ctx, posX, posY, ancho, alto) {
            const img = this.getImagen();
            if (!img.complete) return; 

            ctx.drawImage(
                  img, 
                  this.ejeXinicial, this.ejeYinicial, this.anchoRecorte, this.altoRecorte, // Fuente (recorte)
                  posX, posY, ancho, alto // Destino (en el canvas)
            );
      }
}
export default Imagen;