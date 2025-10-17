export class Cronometro {
      constructor() {
            this.tiempo = 0;
            this.intervalo = null;
      }

      iniciar() {
            if (this.intervalo) return;
            this.intervalo = setInterval(() => {
                  this.tiempo++;
            }, 1000);
      }

      pausar() {
            if (this.intervalo) {
                  clearInterval(this.intervalo);
                  this.intervalo = null;
            }
      }

      reiniciar() {
            this.pausar();
            this.tiempo = 0;
            this.iniciar();
      }

      detener() {
            this.pausar();
            this.tiempo = 0;
      }

      getTiempo() { return this.tiempo; }

      agregarTiempo(segundos) { this.tiempo += segundos; }

      finalizo() { return false; }

      getTiempoFinal() { return this.tiempo; }

      mostrarTiempo() {
            const contador = document.getElementById('contador');
            if (contador) {
                  const minutos = Math.floor(this.tiempo / 60);
                  const segundos = this.tiempo % 60;
                  contador.textContent = `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
            }
      }
}

export default Cronometro;