export class CuentaRegresiva {
    
    constructor(tiempoInicial) { // guarda el tiempo inicial y establece this.tiempoRestante en ese valor
        this.tiempoInicial = tiempoInicial;
        this.tiempoRestante = tiempoInicial;
        this.intervalo = null;
    }

    iniciar() {
        if (this.intervalo) return; // Evita múltiples intervalos
        this.intervalo = setInterval(() => {
            if (this.tiempoRestante > 0) {
                this.tiempoRestante--;
            } else {
                this.pausar(); // se termino el tiempo
            }
        }, 1000);
    }

    pausar() {
        if (this.intervalo) {
            clearInterval(this.intervalo);
            this.intervalo = null;
        }
    }

    reanudar() {
        this.iniciar(); //vuelve a iniciar el intervalo
    }

    reiniciar() {
        this.pausar();
        this.tiempoRestante = this.tiempoInicial;
        this.iniciar();
    }

    detener() {
        this.pausar();
        this.tiempoRestante = this.tiempoInicial;
    }

    // resta segundos y usa math.max para evitar que el tiempo sea negativo (se usa en ayudita)
    restarTiempo(segundos) {
        this.tiempoRestante = Math.max(0, this.tiempoRestante - segundos);
    }

    // informa a blocka.js cuándo se acaba el tiempo
    finalizo() { 
        return this.tiempoRestante <= 0; 
    }

    getTiempoTranscurrido() {
        return this.tiempoInicial - this.tiempoRestante;
    }

    mostrarTiempo() {
        const contador = document.getElementById('contador');
        if (contador) {
            // muestra el tiempo restante
            const minutos = Math.floor(this.tiempoRestante / 60);
            const segundos = this.tiempoRestante % 60;
            contador.textContent = `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
        }
    }
}

export default CuentaRegresiva;