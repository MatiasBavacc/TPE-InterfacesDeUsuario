const passwordInput1 = document.getElementById('contrasena-campo');
const toggleImg1 = document.getElementById('togglePassword');
const login = document.querySelector('.login-form');
const nombreCampo = document.getElementById('nombre-campo');
const contrasenaCampo = document.getElementById('contrasena-campo');
const contAvisor = document.querySelector('.avisor-contador');

nombreCampo.addEventListener('blur', ()=>{validarCamposRegistro(nombreCampo)});
contrasenaCampo.addEventListener('blur', ()=>{validarCamposRegistro(contrasenaCampo)});

toggleImg1.addEventListener('click', () => {
      const isPassword = passwordInput1.type === 'password';
      passwordInput1.type = isPassword ? 'text' : 'password';
      toggleImg1.src = isPassword ? 'img/basil_eye-closed-solid.png' : 'img/Vector.png';
      toggleImg1.className = isPassword ? 'ojocerrado' : 'imagen-contraseña';
});

login.addEventListener('submit', prevenirEnvio);


function prevenirEnvio(event) {
      event.preventDefault();
      const blurBg = document.querySelector('.blur-background');
      blurBg.classList.remove('oculto');
      cuentaRegresiva()
}


function validarCamposRegistro(campo) {
      const label = document.querySelector(`label[for="${campo.id}"]`);
      const dangerSpan = label.querySelector('.danger');

      if(campo === nombreCampo){
            if(campo.value.trim() === '' || campo.value.length < 6) {
                  campo.classList.add('invalid-campo');
                  dangerSpan.classList.remove('oculto');
            } else {
                  campo.classList.remove('invalid-campo');
                  dangerSpan.classList.add('oculto');
            }
      }

      if(campo === contrasenaCampo) {
            if(campo.value.trim() === '' || campo.value.length < 6) {
                  campo.classList.add('invalid-campo');
                  dangerSpan.classList.remove('oculto');
            } else {
                  campo.classList.remove('invalid-campo');
                  dangerSpan.classList.add('oculto');
            }
      }
  
}

function cuentaRegresiva() {
      let contador = 3;

      const intervalo = setInterval(() => {
            if (contador > 0) {
                  contAvisor.textContent = contador;
                  contador--;
            } else {
                  clearInterval(intervalo);
                  window.location.href = 'home.html';
            }
      }, 1000);
}
