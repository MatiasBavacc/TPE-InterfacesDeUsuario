"use strict";

document.addEventListener("DOMContentLoaded", () =>  {
      /** Formulario de Comentarios */
      const formComentario = document.getElementById("comentar");
      const textareaComentario = formComentario.querySelector("textarea");
      const btnCancelar = formComentario.querySelector(".btn-cancelar");
     


      /* Botones de Leer Mas y Leer Menos */
      const btnLeerMas = document.querySelector(".btn-leer-mas");
      const btnLeerMenos = document.querySelector(".btn-leer-menos");

      /* Enviar o Cancelar Formulario de Comentarios */
      formComentario.addEventListener("submit", postComentario);
      btnCancelar.addEventListener("click", vaciarFormulario);
      textareaComentario.addEventListener("input", activarBotones);

      /* Botones de Leer Mas y Leer Menos */
      btnLeerMas.addEventListener("click", toggleLeerMas);
      btnLeerMenos.addEventListener("click", toggleLeerMas);

      

      

});


/** 
 * Muestra mas o menos texto de un comentario. 
 * @author Matias Bava
 * @param {Event} event - Evento del click en el boton.
 * 
 */
function toggleLeerMas(event) {
      const btnLeerMas = event.target;
      const btnLeerMenos = document.querySelector(".btn-leer-menos");

      const comentario = btnLeerMas.closest(".comentario");
      const textoComentado = comentario.querySelector(".texto-comentado");

      textoComentado.classList.toggle("texto-comentado-activo");

      btnLeerMas.classList.toggle("oculto");
      btnLeerMenos.classList.toggle("oculto");
}



function postComentario(event) {
      event.preventDefault(); // Evita que el formulario recargue la página
      const formComentario = document.getElementById("comentar");
      const textarea = formComentario.querySelector("textarea");
      

      if( textarea.value.trim() === ""){

      }else{
            // --- Datos que obtendrías del formulario/sesión ---
            const nombreUsuario = document.querySelector(".comentar .nombre-usuario h3").textContent;
            const avatarSrc = document.querySelector(".comentar .avatar-comentario img").src;
            const nuevoComentarioTexto = textarea.value; // Texto del textarea
            const fechaActual = new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
            const likesIniciales = 0; // Se inicializan en 0
            const dislikesIniciales = 0; // Se inicializan en 0
            // ----------------------------------------------------


            // --- Elemento donde se insertará el nuevo comentario ---
            const seccionComentarios = document.querySelector('.comentarios');
            const divOculto = seccionComentarios.querySelector('.comentario.oculto');

            crearYAgregarComentario(nuevoComentarioTexto, nombreUsuario, avatarSrc, fechaActual, likesIniciales, dislikesIniciales, divOculto);






            console.log("Comentario enviado: " + textarea.value);
            formComentario.reset();
            activarBotones({target: textarea});
      }
}

function activarBotones(event) {
      const textarea = event.target;
      const btnCancelar = document.querySelector(".btn-cancelar, .btn-cancelar-activo");
      const btnComentar = document.querySelector(".btn-comentar, .btn-comentar-activo");

      if (textarea.value.trim() !== "") {
            btnCancelar.classList.add("btn-cancelar-activo");
            btnComentar.classList.add("btn-comentar-activo");

            btnCancelar.classList.remove("btn-cancelar");
            btnComentar.classList.remove("btn-comentar");
      } else {
            btnCancelar.classList.add("btn-cancelar");
            btnComentar.classList.add("btn-comentar");

            btnCancelar.classList.remove("btn-cancelar-activo");
            btnComentar.classList.remove("btn-comentar-activo");
      }
}

function vaciarFormulario(event) {
      event.preventDefault(); // 🚫 Evita que el boton recargue la página
      const formComentario = document.getElementById("comentar");
      const textarea = formComentario.querySelector("textarea");
      if( textarea.value.trim() === ""){

      }else{
            formComentario.reset();
            activarBotones({target: textarea});
      }
}



/**
 * Crea la estructura HTML del comentario y la inserta en el DOM.
 * @param {string} texto - El contenido del comentario.
 * @param {string} nombre - El nombre del usuario.
 * @param {string} avatar - La URL de la imagen del avatar.
 * @param {string} fecha - La fecha de publicación.
 * @param {HTMLElement} divOculto - El div oculto para insertar el comentario antes.
 */
function crearYAgregarComentario(texto, nombre, avatar, fecha, likesIniciales = 0, dislikesIniciales = 0, divOculto) {
      // Límite de caracteres para mostrar los botones "Leer Más/Menos"
      const MAX_CARACTERES = 130;
      const necesitaLeerMas = texto.length > MAX_CARACTERES;

      // 1. Elemento Principal: <div class="comentario">
      const comentarioDiv = document.createElement('div');
      comentarioDiv.className = 'comentario';

      // 2. Bloque de Usuario: <div class="user-comentario">
      const userComentarioDiv = document.createElement('div');
      userComentarioDiv.className = 'user-comentario';

      // 2.1. Avatar: <div class="avatar-comentario">
      const avatarComentarioDiv = document.createElement('div');
      avatarComentarioDiv.className = 'avatar-comentario';

      // 2.1.1. Imagen: <img src="..." alt="..." class="img-foto-comentarios">
      const imgAvatar = document.createElement('img');
      imgAvatar.src = avatar;
      imgAvatar.alt = 'Imagen de usuario';
      imgAvatar.className = 'img-foto-comentarios';
      avatarComentarioDiv.appendChild(imgAvatar);

      // 2.2. Nombre: <div class="nombre-usuario"><h3>...</h3></div>
      const nombreUsuarioDiv = document.createElement('div');
      nombreUsuarioDiv.className = 'nombre-usuario';
      const h3Nombre = document.createElement('h3');
      h3Nombre.textContent = nombre;
      nombreUsuarioDiv.appendChild(h3Nombre);
      
      // Unir Bloque de Usuario
      userComentarioDiv.appendChild(avatarComentarioDiv);
      userComentarioDiv.appendChild(nombreUsuarioDiv);


      // 3. Bloque de Contenido: <div class="recuadro-comentario">
      const recuadroComentarioDiv = document.createElement('div');
      recuadroComentarioDiv.className = 'recuadro-comentario';

      // 3.1. Texto Comentado: <div class="texto-comentado">
      const textoComentadoDiv = document.createElement('div');
      textoComentadoDiv.className = 'texto-comentado';

      // 3.1.1. Párrafo de Texto: <p>...</p>
      const pTexto = document.createElement('p');
      pTexto.textContent = texto;

      // 🟢 LÓGICA DE BOTONES LEER MÁS/MENOS
      function crearBotonesLeerMasMenos() {
            const btnComentarioDiv = document.createElement('div');
            btnComentarioDiv.className = 'btn-comentario';

            // Botón Leer Más
            const btnLeerMas = document.createElement('button');
            btnLeerMas.className = 'btn-leer-mas';
            btnLeerMas.textContent = 'Leer más';
            btnLeerMas.addEventListener('click', toggleLeerMas); // 👈 Añadir el Event Listener
            
            // Botón Leer Menos
            const btnLeerMenos = document.createElement('button');
            btnLeerMenos.className = 'btn-leer-menos oculto'; // Oculto por defecto
            btnLeerMenos.textContent = 'Leer menos';
            btnLeerMenos.addEventListener('click', toggleLeerMas); // 👈 Añadir el Event Listener

            btnComentarioDiv.appendChild(btnLeerMas);
            btnComentarioDiv.appendChild(btnLeerMenos);
            
            // Insertar el contenedor de botones antes de la fecha
            textoComentadoDiv.appendChild(btnComentarioDiv);
            
            // 🔴 FIN LÓGICA LEER MÁS/MENOS
      }

      // 3.1.2. Párrafo de Fecha: <p class="fecha-comentario">...</p>
      const pFecha = document.createElement('p');
      pFecha.className = 'fecha-comentario';
      pFecha.textContent = fecha;

      // 3.1.3. Botones (Likes/Dislikes): <div class="btns-comentarios">
      const btnsComentariosDiv = document.createElement('div');
      btnsComentariosDiv.className = 'btns-comentarios';

      // --- Función Auxiliar para crear un botón con su contador ---
      function crearBotonContador(iconSrc, altText, count) {
            const itemBtnDiv = document.createElement('div');
            itemBtnDiv.className = 'item-btn-comentario';

            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'btn-like'; // Usar la misma clase para ambos

            const img = document.createElement('img');
            img.src = iconSrc;
            img.alt = altText;
            btn.appendChild(img);

            const pContador = document.createElement('p');
            pContador.textContent = count > 0 ? count : ''; // Muestra solo el número si es > 0

            itemBtnDiv.appendChild(btn);
            itemBtnDiv.appendChild(pContador);
            return itemBtnDiv;
      }
      
      // Agregar botones de Like y Dislike
      const likeBtn = crearBotonContador('img/icon-like.png', 'Boton de me gusta', likesIniciales);
      const dislikeBtn = crearBotonContador('img/icon-dislike.png', 'Boton de no me gusta', dislikesIniciales);

      btnsComentariosDiv.appendChild(likeBtn);
      btnsComentariosDiv.appendChild(dislikeBtn);
      
      // Unir Bloque de Contenido
      textoComentadoDiv.appendChild(pTexto);
      if(necesitaLeerMas) {
            crearBotonesLeerMasMenos();
      }
      textoComentadoDiv.appendChild(pFecha);
      textoComentadoDiv.appendChild(btnsComentariosDiv);

      recuadroComentarioDiv.appendChild(textoComentadoDiv);


      // 4. Unir todos los bloques al comentario principal
      comentarioDiv.appendChild(userComentarioDiv);
      comentarioDiv.appendChild(recuadroComentarioDiv);

      // 5. Insertar en el DOM
      divOculto.parentNode.insertBefore(comentarioDiv, divOculto.nextSibling);

}