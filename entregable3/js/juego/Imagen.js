class Imagen {
    constructor(src, ejeXinicial, ejeYinicial, anchoRecorte, altoRecorte, filtro) {
        this.imageOriginal = new Image();
        this.imageOriginal.src = src;
        
        // usamos un canvas fuera de pantalla para almacenar la imagen filtrada
        this.imageFiltrada = document.createElement('canvas');
        // obtenemos el contexto una vez. { willReadFrequently: true } es una pista de optimización
        this.ctxFiltrado = this.imageFiltrada.getContext('2d', { willReadFrequently: true });

        this.ejeXinicial = ejeXinicial;
        this.ejeYinicial = ejeYinicial;
        this.anchoRecorte = anchoRecorte;
        this.altoRecorte = altoRecorte;
        this.filtro = filtro;
        this.isReady = false; // flag para saber si estamos listos para dibujar
    }

    getEjeXinicial() { return this.ejeXinicial; }

    getEjeYinicial() { return this.ejeYinicial; }

    getAnchoRecorte() { return this.anchoRecorte; }

    getAltoRecorte() { return this.altoRecorte; }
    
    /* dibuja desde el canvas fuera de pantalla (imageFiltrada)*/

    dibujar(ctx, ancho, alto) {
        if (!this.isReady) return; // no dibujar si la imagen no está procesada

        ctx.drawImage(
            this.imageFiltrada, // dibuja desde el canvas que tiene la imagen (filtrada o no)
            this.getEjeXinicial(),
            this.getEjeYinicial(),
            this.getAnchoRecorte(),
            this.getAltoRecorte(),
            -ancho / 2,
            -alto / 2,
            ancho,
            alto
        );
    }

    /* función de inicialización asíncrona. Carga la imagen original y aplica el filtro.*/
    async initialize() {
        return new Promise((resolve, reject) => {
            // si la imagen ya está cargada (ej. desde caché)
            if (this.imageOriginal.complete && this.imageOriginal.naturalWidth > 0) {
                this.aplicarFiltro();
                this.isReady = true;
                resolve();
            } else {
                // si la imagen necesita cargarse
                this.imageOriginal.onload = () => {
                    this.aplicarFiltro();
                    this.isReady = true;
                    resolve();
                };
                this.imageOriginal.onerror = () => {
                    reject(new Error(`Error al cargar la imagen: ${this.imageOriginal.src}`));
                };
            }
        });
    }

    /*aplica el filtro al canvas fuera de pantalla (imageFiltrada).*/
    aplicarFiltro() {
        const img = this.imageOriginal;
        
        // configura el tamaño del canvas al de la imagen original
        this.imageFiltrada.width = img.naturalWidth;
        this.imageFiltrada.height = img.naturalHeight;
        
        // dibuja la imagen original en el canvas fuera de pantalla
        this.ctxFiltrado.drawImage(img, 0, 0);

        // si el filtro es el base (sin efecto), no hace nada más
        if (!this.filtro || typeof this.filtro.getR !== 'function' || this.filtro.constructor.name === 'Filtro') {
            return;
        }

        // obtiene los datos de píxeles del canvas
        const imageData = this.ctxFiltrado.getImageData(0, 0, img.naturalWidth, img.naturalHeight);

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
        
        // vuelve a poner los datos de píxeles modificados en el canvas
        this.ctxFiltrado.putImageData(imageData, 0, 0);
    }

    /* vuelve a dibujar la imagen original en el canvas fuera de pantalla. */
    sacarFiltro() {
        this.ctxFiltrado.drawImage(this.imageOriginal, 0, 0, this.imageFiltrada.width, this.imageFiltrada.height);
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
    
    // estas funciones ya no son necesarias
    // getImagen() 
    // cargarYAplicar()
    // cargarImagen()
    // getImageDataFromImage()
}
export default Imagen;