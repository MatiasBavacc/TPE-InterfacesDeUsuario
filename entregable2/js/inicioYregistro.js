const passwordInput = document.getElementById('contrasena-campo');
const toggleImg = document.getElementById('togglePassword');

const registro = document.querySelector('.registro-form');
const login = document.querySelector('.login-form');

toggleImg.addEventListener('click', () => {
  const isPassword = passwordInput.type === 'password';
  passwordInput.type = isPassword ? 'text' : 'password';
  // Opcional: Cambia la imagen según el estado
  toggleImg.src = isPassword ? 'img/Vector.png' : 'img/basil_eye-closed-solid.png';
});



registro.addEventListener('submit', prevenirEnvio);
login.addEventListener('submit', prevenirEnvio);

function prevenirEnvio(event) {
  event.preventDefault();
  window.location.href = 'index.html';
}