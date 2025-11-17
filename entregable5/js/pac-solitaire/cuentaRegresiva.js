export class CuentaRegresiva {
   constructor(tiempoInicial) {
      this.tiempoInicial = tiempoInicial;
      this.tiempoRestante = tiempoInicial;
      this.intervalo = null;
   }

   iniciar() {
      if (this.intervalo) return;
      this.intervalo = setInterval(() => {
         if (this.tiempoRestante > 0) {
            this.tiempoRestante--;
            this.mostrarTiempo();
         } else {
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

   reanudar() {
      this.iniciar();
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

   restarTiempo(segundos) {
      this.tiempoRestante = Math.max(0, this.tiempoRestante - segundos);
   }

   finalizo() {
      return this.tiempoRestante <= 0;
   }

   getTiempoTranscurrido() {
      return this.tiempoInicial - this.tiempoRestante;
   }

   mostrarTiempo() {
      const contador = document.getElementById('contador');
      if (contador) {
         const minutos = Math.floor(this.tiempoRestante / 60);
         const segundos = this.tiempoRestante % 60;
         contador.textContent = `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
      }
   }
}

export default CuentaRegresiva;
