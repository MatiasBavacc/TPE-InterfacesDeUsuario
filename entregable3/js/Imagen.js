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

      aplicarFiltro(ctx, posX = this.ejeXinicial, posY = this.ejeYinicial, ancho = this.anchoRecorte, alto = this.altoRecorte, filtro) {
            const img = this.getImagen();
            if (!img.complete) return;
            const imageData = this.getImageDataFromImage(img);
            for(let i = posX; i < posX + ancho; i++) {
                  for(let j = posY; j < posY + alto; j++) {
                        const pixel = this.getPixel(imageData, i, j);
                        filtro.setR(pixel.r);
                        filtro.setG(pixel.g);
                        filtro.setB(pixel.b);
                        filtro.setA(pixel.a);
                        const r = filtro.getR(pixel.r);
                        const g = filtro.getG(pixel.g);
                        const b = filtro.getB(pixel.b);
                        const a = filtro.getA(pixel.a);
                        this.setPixel(imageData, i, j, r, g, b, a);
                  }
                  ctx.putImageData(imageData, this.ejeXinicial, this.ejeYinicial);
            }
      }

      setPixel(imageData, x, y, r, g, b, a) {
            const index = (x + y * imageData.width) * 4;
            imageData.data[index + 0] = r;
            imageData.data[index + 1] = g;
            imageData.data[index + 2] = b;
            imageData.data[index + 3] = a;
      }

      getPixel(imageData, x, y) {
            const index = (x + y * imageData.width) * 4;
            const r = imageData.data[index + 0];
            const g = imageData.data[index + 1];
            const b = imageData.data[index + 2];
            const a = imageData.data[index + 3];
            return { r, g, b, a };
      }


      getImageDataFromImage(img) {
            const tempCanvas = document.createElement("canvas");
            const tempCtx = tempCanvas.getContext("2d");
            tempCanvas.width = img.width;
            tempCanvas.height = img.height;
            tempCtx.drawImage(img, 0, 0);
            return tempCtx.getImageData(0, 0, img.width, img.height);
      }

      
}
export default Imagen;