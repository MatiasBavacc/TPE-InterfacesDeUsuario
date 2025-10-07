const passwordInput1 = document.getElementById('contrasena-campo');
const toggleImg1 = document.getElementById('togglePassword');
const login = document.querySelector('.login-form');
const nombreCampo = document.getElementById('nombre-campo');
const contrasenaCampo = document.getElementById('contrasena-campo');

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
      window.location.href = 'home.html';
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

