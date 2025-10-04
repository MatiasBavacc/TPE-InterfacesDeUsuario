const passwordInput1 = document.getElementById('contrasena-campo');
const toggleImg1 = document.getElementById('togglePassword');
const passwordInput2 = document.getElementById('repetir-contrasena-campo');
const toggleImg2 = document.getElementById('togglePassword2');

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
