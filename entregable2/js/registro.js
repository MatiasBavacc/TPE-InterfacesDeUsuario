const passwordInput1 = document.getElementById('contrasena-campo');
const toggleImg1 = document.getElementById('togglePassword');
const passwordInput2 = document.getElementById('repetir-contrasena-campo');
const toggleImg2 = document.getElementById('togglePassword2');
const registro = document.querySelector('.registro-form');
const nombreCampo = document.getElementById('nombre-campo');
const apellidoCampo = document.getElementById('apellido-campo');
const gmailCampo = document.getElementById('gmail-campo');

toggleImg1.addEventListener('click', () => {
  const isPassword = passwordInput1.type === 'password';
  passwordInput1.type = isPassword ? 'text' : 'password';
  toggleImg1.src = isPassword ? 'img/basil_eye-closed-solid.png' : 'img/Vector.png';
  toggleImg1.className = isPassword ? 'ojocerrado' : 'imagen-contraseña';
});

toggleImg2.addEventListener('click', () => {
  const isPassword = passwordInput2.type === 'password';
  passwordInput2.type = isPassword ? 'text' : 'password';
  toggleImg2.src = isPassword ? 'img/basil_eye-closed-solid.png' : 'img/Vector.png';
  toggleImg2.className = isPassword ? 'ojocerrado' : 'imagen-contraseña';
});

registro.addEventListener('submit', prevenirEnvio);

function prevenirEnvio(event) {
  event.preventDefault();
  window.location.href = 'home.html';
}

nombreCampo.addEventListener('blur', ()=>{validarCamposRegistro(nombreCampo)});
apellidoCampo.addEventListener('blur', ()=>{validarCamposRegistro(apellidoCampo)});
passwordInput1.addEventListener('blur', ()=>{validarCamposRegistro(passwordInput1)});
passwordInput2.addEventListener('blur', ()=>{validarCamposRegistro(passwordInput2)});
passwordInput2.addEventListener('input', ()=>{validarContraseñas(passwordInput2)});
gmailCampo.addEventListener('blur', ()=>{validarCamposRegistro(gmailCampo)});

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
    return;
  }

  if(campo === passwordInput1) {
    if(campo.value.trim() === '' || campo.value.length < 6) {
      campo.classList.add('invalid-campo');
      dangerSpan.classList.remove('oculto');
    } else {
      campo.classList.remove('invalid-campo');
      dangerSpan.classList.add('oculto');
    }
    return;
  }

  if(campo === passwordInput2) {
    if(campo.value.trim() === '' || campo.value.length < 6 || passwordInput1.value !== passwordInput2.value) {
      campo.classList.add('invalid-campo');
      dangerSpan.classList.remove('oculto');
    } else {
      campo.classList.remove('invalid-campo');
      dangerSpan.classList.add('oculto');
    }
    return;
  }

  if(campo === gmailCampo) {
    if(campo.value.trim() === '' || campo.value.length < 7 || !campo.value.includes('@') || !campo.value.includes('.')) {
      campo.classList.add('invalid-campo');
      dangerSpan.classList.remove('oculto');
    } else {
      campo.classList.remove('invalid-campo');
      dangerSpan.classList.add('oculto');
    }
    return;
  }

  if(campo === apellidoCampo) {
    if(campo.value.trim() === '' || campo.value.length < 6) {
      campo.classList.add('invalid-campo');
      dangerSpan.classList.remove('oculto');
    } else {
      campo.classList.remove('invalid-campo');
      dangerSpan.classList.add('oculto');
    }
  }
}

function validarContraseñas(campo){
  const label = document.querySelector(`label[for="${campo.id}"]`);
  const dangerSpan = label.querySelector('.danger');
  if(passwordInput1.value !== passwordInput2.value){
    campo.classList.add('invalid-campo');
    dangerSpan.classList.remove('oculto');
  } else {
    campo.classList.remove('invalid-campo');
    dangerSpan.classList.add('oculto');
  }
}


