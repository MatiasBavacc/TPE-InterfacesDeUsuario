import Cronometro from "./cronometro.js";

export class CuentaRegresiva extends Cronometro {
      constructor(tiempo) {
            super();
            this.tiempo = tiempo;
            this.duracion = tiempo;
            this.intervalo = null;
      }

      iniciar() {
            if (this.intervalo) return;
            this.intervalo = setInterval(() => {
                  this.tiempo--;
                  if (this.tiempo <= 0) {
                        this.pausar();
                  }
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
            this.tiempo = this.duracion;
            this.iniciar();
      }

      detener() {
            this.pausar();
            this.tiempo = this.duracion;
      }

      agregarTiempo(segundos) { this.tiempo -= segundos; }

      finalizo() { return this.tiempo <= 0; }
}
export default CuentaRegresiva;