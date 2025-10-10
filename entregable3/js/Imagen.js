class Imagen {
      constructor(src, ejeXinicial, ejeYinicial, anchoRecorte, altoRecorte, filtro) {
            this.imageOriginal = new Image();
            this.imageOriginal.src = src;
            this.image = new Image();
            this.image.src = src;
            this.ejeXinicial = ejeXinicial;
            this.ejeYinicial = ejeYinicial;
            this.anchoRecorte = anchoRecorte;
            this.altoRecorte = altoRecorte;
            this.filtro = filtro;
            this.aplicarFiltro();
      }

      getImagen() { return this.image; }

      getEjeXinicial() { return this.ejeXinicial; }

      getEjeYinicial() { return this.ejeYinicial; }

      getAnchoRecorte() { return this.anchoRecorte; }

      getAltoRecorte() { return this.altoRecorte; }
      

      dibujar(ctx, ancho, alto) {
            const img = this.getImagen();
            if (!img.complete) return; 

            ctx.drawImage(
                  img,
                  this.getEjeXinicial(),
                  this.getEjeYinicial(),
                  this.getAnchoRecorte(),
                  this.getAltoRecorte(),
                  -ancho / 2,  // centrado horizontal
                  -alto / 2,   // centrado vertical
                  ancho,
                  alto
            );
      }

      aplicarFiltro() {
            const img = this.getImagen();
            if (!img.complete) return;

            const imageData = this.getImageDataFromImage(img);

            for (let y = 0; y < imageData.height; y++) {
                  for (let x = 0; x < imageData.width; x++) {
                        const pixel = this.getPixel(imageData, x, y);
                        this.filtro.setR(pixel.r);
                        this.filtro.setG(pixel.g);
                        this.filtro.setB(pixel.b);
                        this.filtro.setA(pixel.a);
                        this.setPixel(
                        imageData, x, y,
                        this.filtro.getR(pixel.r),
                        this.filtro.getG(pixel.g),
                        this.filtro.getB(pixel.b),
                        this.filtro.getA(pixel.a)
                        );
                  }
            }

            // Crear canvas temporal solo para reemplazar la textura
            const tempCanvas = document.createElement("canvas");
            const tempCtx = tempCanvas.getContext("2d");
            tempCanvas.width = imageData.width;
            tempCanvas.height = imageData.height;
            tempCtx.putImageData(imageData, 0, 0);

            // Actualizar la imagen en memoria
            this.image.src = tempCanvas.toDataURL();
      }

      sacarFiltro() {
            this.image.src = this.imageOriginal.src;
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