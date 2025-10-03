const passwordInput = document.getElementById('contrasena-campo');
const toggleImg = document.getElementById('togglePassword');

toggleImg.addEventListener('click', () => {
  const isPassword = passwordInput.type === 'password';
  passwordInput.type = isPassword ? 'text' : 'password';
  // Opcional: Cambia la imagen según el estado
  toggleImg.src = isPassword ? 'img/Vector.png' : 'img/basil_eye-closed-solid.png';
});