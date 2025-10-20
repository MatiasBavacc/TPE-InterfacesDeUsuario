// *** NOMBRE DE CLASE CORREGIDO ***
export class CuentaRegresiva {
    
    // *** LÓGICA CORREGIDA ***
    constructor(tiempoInicial) {
        this.tiempoInicial = tiempoInicial;
        this.tiempoRestante = tiempoInicial;
        this.intervalo = null;
    }

    iniciar() {
        if (this.intervalo) return; // Evita múltiples intervalos
        
        // *** LÓGICA CORREGIDA (DECREMENTO) ***
        this.intervalo = setInterval(() => {
            if (this.tiempoRestante > 0) {
                this.tiempoRestante--;
            } else {
                this.pausar(); // Se acabó el tiempo
            }
        }, 1000);
    }

    pausar() {
        if (this.intervalo) {
            clearInterval(this.intervalo);
            this.intervalo = null;
        }
    }

    // *** MÉTODO AÑADIDO ***
    reanudar() {
        this.iniciar(); // Vuelve a iniciar el intervalo
    }

    reiniciar() {
        this.pausar();
        // *** LÓGICA CORREGIDA ***
        this.tiempoRestante = this.tiempoInicial;
        this.iniciar();
    }

    detener() {
        this.pausar();
        this.tiempoRestante = this.tiempoInicial;
    }

    // *** MÉTODO AÑADIDO (para la penalización de 'ayudita') ***
    restarTiempo(segundos) {
        this.tiempoRestante = Math.max(0, this.tiempoRestante - segundos);
    }

    // *** LÓGICA CORREGIDA ***
    // Informa a blocka.js cuándo se acaba el tiempo
    finalizo() { 
        return this.tiempoRestante <= 0; 
    }

    getTiempoTranscurrido() {
        return this.tiempoInicial - this.tiempoRestante;
    }

    // *** LÓGICA CORREGIDA ***
    mostrarTiempo() {
        const contador = document.getElementById('contador');
        if (contador) {
            // Muestra el tiempo restante
            const minutos = Math.floor(this.tiempoRestante / 60);
            const segundos = this.tiempoRestante % 60;
            contador.textContent = `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
        }
    }
}

// *** EXPORT DEFAULT CORREGIDO ***
export default CuentaRegresiva;