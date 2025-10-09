"use strict";

document.addEventListener("DOMContentLoaded", () =>  {
      /** Formulario de Comentarios */
      const formComentario = document.getElementById("comentar");
      const textareaComentario = formComentario.querySelector("textarea");
      const btnCancelar = formComentario.querySelector(".btn-cancelar");
     
      /* Botones de Leer Mas y Leer Menos */
      const btnLeerMas = document.querySelector(".btn-leer-mas");
      const btnLeerMenos = document.querySelector(".btn-leer-menos");

      /* Contadores de Likes y Dislikes */
      const botonesLike = document.querySelectorAll(".btn-like");
      const botonesDislike = document.querySelectorAll(".btn-dislike");
      
      /* PopApp Compartir y Ranking */
      const btnCompartir = document.getElementById("btnCompartir");
      const btnRanking = document.getElementById("btnRanking");
      const popAppCompartir = document.querySelector(".section-compartir");
      const popAppRanking = document.querySelector(".section-ranking");

      /* Boton Maximizar */
      const maximizar = document.querySelector(".maximizar");
      const juego = document.querySelector(".canvas-game");
      
      /* Enviar o Cancelar Formulario de Comentarios */
      formComentario.addEventListener("submit", postComentario);
      btnCancelar.addEventListener("click", vaciarFormulario);
      textareaComentario.addEventListener("input", activarBotones);

      /* Botones de Leer Mas y Leer Menos */
      btnLeerMas.addEventListener("click", toggleLeerMas);
      btnLeerMenos.addEventListener("click", toggleLeerMas);

      /* Contadores de Likes y Dislikes */
      botonesLike.forEach(boton => {
            boton.addEventListener("click", botonLikeDislike);
      });
      botonesDislike.forEach(boton => {
            boton.addEventListener("click", botonLikeDislike);
      });

      /* Mostrar u Ocultar PopApp Compartir y Ranking */
      btnCompartir.addEventListener("click", tooglePopApp);
      btnRanking.addEventListener("click", tooglePopApp);

      document.addEventListener("click", (e) => {
            // Si el click NO fue dentro de btnCompartir
            if (!btnCompartir.contains(e.target)) {
            popAppCompartir.classList.add("oculto");
            }

            // Si el click NO fue dentro de btnRanking
            if (!btnRanking.contains(e.target)) {
            popAppRanking.classList.add("oculto");
            }
      });


      const btnFavoritos = document.getElementById('btnFavoritos');
      const favsIconBtn = document.querySelector('.header-right .icon-btn.favs');

      if (btnFavoritos && favsIconBtn) {
            btnFavoritos.addEventListener('click', () => {
                  crearCorazonVolador(btnFavoritos, favsIconBtn);
            });
      } else {
            console.warn('btnFavoritos or favsIconBtn not found in the DOM');
      }

      function crearCorazonVolador(origen, destino) {
            const corazon = document.createElement('div');
            corazon.innerHTML = '<img src="img/icon-favorito.png" alt="Corazón">';
            corazon.classList.add('corazon-volador');
            document.body.appendChild(corazon);

            // Obtener la posición absoluta del botón de origen
            const origenRect = origen.getBoundingClientRect();
            const origenTop = origenRect.top + window.scrollY; // Considera el scroll vertical
            const origenLeft = origenRect.left + window.scrollX; // Considera el scroll horizontal
            const origenCenterX = origenLeft + origenRect.width / 2;
            const origenCenterY = origenTop + origenRect.height / 2;

            corazon.style.left = (origenCenterX - 10) + 'px';
            corazon.style.top = (origenCenterY - 10) + 'px';

            // Obtener la posición absoluta del botón de destino
            const destinoRect = destino.getBoundingClientRect();
            const destinoTop = destinoRect.top + window.scrollY;
            const destinoLeft = destinoRect.left + window.scrollX;
            const destinoCenterX = destinoLeft + destinoRect.width / 2;
            const destinoCenterY = destinoTop + destinoRect.height / 2;

            // Define la animación
            corazon.animate([
                  { transform: `translate(0, 0)`, opacity: 1 },
                  { transform: `translate(${destinoCenterX - origenCenterX}px, ${destinoCenterY - origenCenterY}px)`, opacity: 0 }
            ], {
                  duration: 1000,
                  easing: 'ease-in-out',
                  fill: 'forwards'
            }).finished.then(() => {
                  corazon.remove();
            });
      }

      /* Boton Maximizar */
      maximizar.addEventListener("click", () => {
            if (!document.fullscreenElement) {
                  // Entra en modo pantalla completa
                  juego.requestFullscreen();
            } else {
                  // Sale de pantalla completa si ya está
                  document.exitFullscreen();
            }
      });
});

function tooglePopApp(event) {
      const btn = event.currentTarget;
      let popApp;
      if(btn.classList.contains("compartir")){
            popApp = document.querySelector(".section-compartir");
      }else{
            popApp = document.querySelector(".section-ranking");
      }
      popApp.classList.toggle("oculto");
}

/** 
 * Muestra mas o menos texto de un comentario. 
 * @author Matias Bava
 * @param {Event} event - Evento del click en el boton.
 * 
 */
function toggleLeerMas(event) {
      let btnLeerMas = event.target;
      const comentario = btnLeerMas.closest(`.comentario`);

      const btnLeerMenos = comentario.querySelector(".btn-leer-menos");
      btnLeerMas = comentario.querySelector(".btn-leer-mas");
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
            /* Si esta vacio que no haga nada! */
      }else{
            // --- Datos que obtendrías del formulario/sesión ---
            const nombreUsuario = document.querySelector(".comentar .nombre-usuario h4").textContent;
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

function botonLikeDislike(event) {
      let btnLike = event.currentTarget;
      const comentario = btnLike.closest(`.comentario`);
      let btnDisLike = comentario.querySelector(".btn-dislike");
      let contador;
      let otroContador;
      let imgbtnLike = comentario.querySelector(".btnLike");
      let imgbtnDislike = comentario.querySelector(".btnDislike");

      if(btnLike.classList.contains("btn-like")){
            contador = comentario.querySelector(".cont-like");
            otroContador = comentario.querySelector(".cont-dislike");
            if(contador.dataset.value === "active"){
                  manejarContadorMenos(contador);
                  contador.dataset.value = "inactive";
                  actualizarEstadoBoton(imgbtnLike);
            }else{
                  manejarContadorMas(contador);
                  contador.dataset.value = "active";
                  if(otroContador.dataset.value === "active"){
                        manejarContadorMenos(otroContador);
                        otroContador.dataset.value = "inactive";
                  }
            }
      }else{
            contador = comentario.querySelector(".cont-dislike");
            otroContador = comentario.querySelector(".cont-like");
            if(contador.dataset.value === "active"){
                  manejarContadorMenos(contador);
                  contador.dataset.value = "inactive";
                  actualizarEstadoBoton(imgbtnDislike);
            }else{
                  manejarContadorMas(contador);
                  contador.dataset.value = "active";
                  if(otroContador.dataset.value === "active"){
                        otroContador.textContent = parseInt(otroContador.textContent) - 1;
                        otroContador.dataset.value = "inactive";
                  }
            }
      }
      
      function actualizarEstadoBoton(imgBtn1 = 0, imgBtn2 = 0) {
            if(imgBtn1.classList.contains("btnLike")){
                  imgBtn1.classList.toggle("btnLike-active");
            }else{
                  imgBtn1.classList.toggle("btnDislike-active");
            }

            if(imgBtn2.classList.contains("btnDisLike")){
                  imgBtn2.classList.toggle("btnDisLike-active");
            }else{
                  imgBtn2.classList.toggle("btnLike-active");
            }
      }

      function manejarContadorMas(contador){
            if(contador.textContent === ""){
                  contador.textContent = 1;
            }else{
                  contador.textContent = parseInt(contador.textContent) + 1;
            }
      }

      function manejarContadorMenos(contador){
            if(contador.textContent !== ""){
                  contador.textContent = parseInt(contador.textContent) - 1;
            }
      }
}




/**
 * Crea la estructura HTML del comentario y la inserta en el DOM.
 * @param {string} texto - El contenido del comentario.
 * @param {string} nombre - El nombre del usuario.
 * @param {string} avatar - La URL de la imagen del avatar.
 * @param {string} fecha - La fecha de publicación.
 * @param {number} likesIniciales - Cantidad inicial de likes (por defecto 0).
 * @param {number} dislikesIniciales - Cantidad inicial de dislikes (por defecto 0).
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

      // 2.2. Nombre: <div class="nombre-usuario"><h4>...</h4></div>
      const nombreUsuarioDiv = document.createElement('div');
      nombreUsuarioDiv.className = 'nombre-usuario';
      const h4Nombre = document.createElement('h4');
      h4Nombre.textContent = nombre;
      nombreUsuarioDiv.appendChild(h4Nombre);
      
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

      // LÓGICA DE BOTONES LEER MÁS/MENOS
      function crearBotonesLeerMasMenos() {
            const btnComentarioDiv = document.createElement('div');
            btnComentarioDiv.className = 'btn-comentario';

            // Botón Leer Más
            const btnLeerMas = document.createElement('button');
            btnLeerMas.className = 'btn-leer-mas';
            btnLeerMas.textContent = 'Leer más';
            btnLeerMas.addEventListener('click', toggleLeerMas); // Añadir el Event Listener
            
            // Botón Leer Menos
            const btnLeerMenos = document.createElement('button');
            btnLeerMenos.className = 'btn-leer-menos oculto'; // Oculto por defecto
            btnLeerMenos.textContent = 'Leer menos';
            btnLeerMenos.addEventListener('click', toggleLeerMas); // Añadir el Event Listener

            btnComentarioDiv.appendChild(btnLeerMas);
            btnComentarioDiv.appendChild(btnLeerMenos);
            
            // Insertar el contenedor de botones antes de la fecha
            textoComentadoDiv.appendChild(btnComentarioDiv);
            
            //  FIN LÓGICA LEER MÁS/MENOS
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
            btn.className = altText === 'Boton de me gusta' ? 'btn-like' : 'btn-dislike';

            const img = document.createElement('div');
            img.className = altText === 'Boton de me gusta' ? 'btnLike' : 'btnDislike';
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
