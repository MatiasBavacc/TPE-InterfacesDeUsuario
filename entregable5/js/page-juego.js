"use strict";

import {resetGame} from './flappy/flappy-game.js';

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
    const juego = document.getElementById("game-container");

    const blur = document.querySelector(".blur");
    const btnJugar = document.querySelector(".btn-jugar");
    const imgJuego = document.querySelector(".img-juego");
    const flappyGame = document.getElementById("flappy-bird-game");

    btnJugar.addEventListener("click", () => {
        // 1. Oculta la interfaz inicial
        btnJugar.classList.add("oculto");
        blur.classList.add("oculto");
        if (imgJuego) {
            imgJuego.classList.add("oculto");
        }

        btnJugar.blur();
        // 2. Muestra el contenedor del juego Flappy Bird
        flappyGame.classList.remove("oculto");

        // 3. Inicia el juego Flappy Bird
        resetGame();
    });
    
    /* Enviar o Cancelar Formulario de Comentarios */
    if(formComentario) formComentario.addEventListener("submit", postComentario);
    if(btnCancelar) btnCancelar.addEventListener("click", vaciarFormulario);
    if(textareaComentario) textareaComentario.addEventListener("input", activarBotones);

    /* Botones de Leer Mas y Leer Menos */
    if(btnLeerMas) btnLeerMas.addEventListener("click", toggleLeerMas);
    if(btnLeerMenos) btnLeerMenos.addEventListener("click", toggleLeerMas);

    /* Contadores de Likes y Dislikes */
    botonesLike.forEach(boton => {
        boton.addEventListener("click", botonLikeDislike);
    });
    botonesDislike.forEach(boton => {
        boton.addEventListener("click", botonLikeDislike);
    });

    /* Mostrar u Ocultar PopApp Compartir y Ranking */
    if(btnCompartir) btnCompartir.addEventListener("click", tooglePopApp);
    if(btnRanking) btnRanking.addEventListener("click", tooglePopApp);

    document.addEventListener("click", (e) => {
        if(popAppCompartir && !btnCompartir.contains(e.target)) {
            popAppCompartir.classList.add("oculto");
        }
        if(popAppRanking && !btnRanking.contains(e.target)) {
            popAppRanking.classList.add("oculto");
        }
    });


    const btnFavoritos = document.getElementById('btnFavoritos');
    const favsIconBtn = document.querySelector('.header-right .icon-btn.favs');

    if (btnFavoritos && favsIconBtn) {
        btnFavoritos.addEventListener('click', () => {
            crearCorazonVolador(btnFavoritos, favsIconBtn);
        });
    }

    function crearCorazonVolador(origen, destino) {
        // ... (Tu función crearCorazonVolador sin cambios) ...
        const corazon = document.createElement('div');
        corazon.innerHTML = '<img src="img/icon-favorito.png" alt="Corazón">';
        corazon.classList.add('corazon-volador');
        document.body.appendChild(corazon);
        const origenRect = origen.getBoundingClientRect();
        const origenTop = origenRect.top + window.scrollY;
        const origenLeft = origenRect.left + window.scrollX;
        const origenCenterX = origenLeft + origenRect.width / 2;
        const origenCenterY = origenTop + origenRect.height / 2;
        corazon.style.left = (origenCenterX - 10) + 'px';
        corazon.style.top = (origenCenterY - 10) + 'px';
        const destinoRect = destino.getBoundingClientRect();
        const destinoTop = destinoRect.top + window.scrollY;
        const destinoLeft = destinoRect.left + window.scrollX;
        const destinoCenterX = destinoLeft + destinoRect.width / 2;
        const destinoCenterY = destinoTop + destinoRect.height / 2;
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

    /* Boton Maximizar (se mantiene) */
    if(maximizar) maximizar.addEventListener("click", () => {
        if (!document.fullscreenElement) {
            juego.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    });
});

function tooglePopApp(event) {
    // ... (Tu función tooglePopApp sin cambios) ...
    const btn = event.currentTarget;
    let popApp;
    if(btn.classList.contains("compartir")){
        popApp = document.querySelector(".section-compartir");
    }else{
        popApp = document.querySelector(".section-ranking");
    }
    popApp.classList.toggle("oculto");
}

function toggleLeerMas(event) {
    // ... (Tu función toggleLeerMas sin cambios) ...
    let btnLeerMasEl = event.target;
    const comentario = btnLeerMasEl.closest(`.comentario`);
    const btnLeerMenos = comentario.querySelector(".btn-leer-menos");
    const btnLeerMas = comentario.querySelector(".btn-leer-mas");
    const textoComentado = comentario.querySelector(".texto-comentado");
    textoComentado.classList.toggle("texto-comentado-activo");
    btnLeerMas.classList.toggle("oculto");
    btnLeerMenos.classList.toggle("oculto");
}

function postComentario(event) {
    // ... (Tu función postComentario sin cambios) ...
    event.preventDefault(); 
    const formComentario = document.getElementById("comentar");
    const textarea = formComentario.querySelector("textarea");
    if( textarea.value.trim() !== ""){
        const nombreUsuario = document.querySelector(".comentar .nombre-usuario h4").textContent;
        const avatarSrc = document.querySelector(".comentar .avatar-comentario img").src;
        const nuevoComentarioTexto = textarea.value;
        const fechaActual = new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
        const seccionComentarios = document.querySelector('.comentarios');
        const divOculto = seccionComentarios.querySelector('.comentario.oculto');
        crearYAgregarComentario(nuevoComentarioTexto, nombreUsuario, avatarSrc, fechaActual, 0, 0, divOculto);
        formComentario.reset();
        activarBotones({target: textarea});
    }
}

function activarBotones(event) {
    // ... (Tu función activarBotones sin cambios) ...
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
    // ... (Tu función vaciarFormulario sin cambios) ...
    event.preventDefault(); 
    const formComentario = document.getElementById("comentar");
    const textarea = formComentario.querySelector("textarea");
    if( textarea.value.trim() !== ""){
        formComentario.reset();
        activarBotones({target: textarea});
    }
}

function botonLikeDislike(event) {
    // ... (Tu función botonLikeDislike sin cambios, con las correcciones de la última vez) ...
    let btnLike = event.currentTarget;
    const comentario = btnLike.closest(`.comentario`);
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
                actualizarEstadoBoton(imgbtnDislike); 
            }
            actualizarEstadoBoton(imgbtnLike); 
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
                manejarContadorMenos(otroContador); 
                otroContador.dataset.value = "inactive";
                actualizarEstadoBoton(imgbtnLike); 
            }
            actualizarEstadoBoton(imgbtnDislike); 
        }
    }
    
    function actualizarEstadoBoton(imgBtn) {
        if(imgBtn.classList.contains("btnLike")){
            imgBtn.classList.toggle("btnLike-active");
        }else{
            imgBtn.classList.toggle("btnDislike-active");
        }
    }
    function manejarContadorMas(contador){
        if(contador.textContent === ""){ contador.textContent = 1; }
        else{ contador.textContent = parseInt(contador.textContent) + 1; }
    }
    function manejarContadorMenos(contador){
        let valor = parseInt(contador.textContent);
        if(valor === 1){ contador.textContent = ""; } 
        else if (valor > 1){ contador.textContent = valor - 1; }
    }
}

function crearYAgregarComentario(texto, nombre, avatar, fecha, likesIniciales = 0, dislikesIniciales = 0, divOculto) {
    // ... (Tu función crearYAgregarComentario sin cambios) ...
    const MAX_CARACTERES = 130;
    const necesitaLeerMas = texto.length > MAX_CARACTERES;
    const comentarioDiv = document.createElement('div');
    comentarioDiv.className = 'comentario';
    const userComentarioDiv = document.createElement('div');
    userComentarioDiv.className = 'user-comentario';
    const avatarComentarioDiv = document.createElement('div');
    avatarComentarioDiv.className = 'avatar-comentario';
    const imgAvatar = document.createElement('img');
    imgAvatar.src = avatar;
    imgAvatar.alt = 'Imagen de usuario';
    imgAvatar.className = 'img-foto-comentarios';
    avatarComentarioDiv.appendChild(imgAvatar);
    const nombreUsuarioDiv = document.createElement('div');
    nombreUsuarioDiv.className = 'nombre-usuario';
    const h4Nombre = document.createElement('h4');
    h4Nombre.textContent = nombre;
    nombreUsuarioDiv.appendChild(h4Nombre);
    userComentarioDiv.appendChild(avatarComentarioDiv);
    userComentarioDiv.appendChild(nombreUsuarioDiv);
    const recuadroComentarioDiv = document.createElement('div');
    recuadroComentarioDiv.className = 'recuadro-comentario';
    const textoComentadoDiv = document.createElement('div');
    textoComentadoDiv.className = 'texto-comentado';
    if (!necesitaLeerMas) {
        textoComentadoDiv.classList.add("texto-comentado-activo");
    }
    const pTexto = document.createElement('p');
    pTexto.textContent = texto;
    const pFecha = document.createElement('p');
    pFecha.className = 'fecha-comentario';
    pFecha.textContent = fecha;
    const btnsComentariosDiv = document.createElement('div');
    btnsComentariosDiv.className = 'btns-comentarios';

    function crearBotonContador(tipo, count) {
        const itemBtnDiv = document.createElement('div');
        itemBtnDiv.className = 'item-btn-comentario';
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = tipo === 'like' ? 'btn-like' : 'btn-dislike';
        btn.addEventListener('click', botonLikeDislike); 
        const img = document.createElement('div');
        img.className = tipo === 'like' ? 'btnLike' : 'btnDislike';
        btn.appendChild(img);
        const pContador = document.createElement('p');
        pContador.className = tipo === 'like' ? 'cont-like' : 'cont-dislike';
        pContador.textContent = count > 0 ? count : '';
        pContador.dataset.value = "inactive"; 
        itemBtnDiv.appendChild(btn);
        itemBtnDiv.appendChild(pContador);
        return itemBtnDiv;
    }
    
    btnsComentariosDiv.appendChild(crearBotonContador('like', likesIniciales));
    btnsComentariosDiv.appendChild(crearBotonContador('dislike', dislikesIniciales));
    textoComentadoDiv.appendChild(pTexto);
    if(necesitaLeerMas) {
        const btnComentarioDiv = document.createElement('div');
        btnComentarioDiv.className = 'btn-comentario';
        const btnLeerMas = document.createElement('button');
        btnLeerMas.className = 'btn-leer-mas';
        btnLeerMas.textContent = 'Leer más';
        btnLeerMas.addEventListener('click', toggleLeerMas); 
        const btnLeerMenos = document.createElement('button');
        btnLeerMenos.className = 'btn-leer-menos oculto';
        btnLeerMenos.textContent = 'Leer menos';
        btnLeerMenos.addEventListener('click', toggleLeerMas); 
        btnComentarioDiv.appendChild(btnLeerMas);
        btnComentarioDiv.appendChild(btnLeerMenos);
        textoComentadoDiv.appendChild(btnComentarioDiv);
    }
    textoComentadoDiv.appendChild(pFecha);
    textoComentadoDiv.appendChild(btnsComentariosDiv);
    recuadroComentarioDiv.appendChild(textoComentadoDiv);
    comentarioDiv.appendChild(userComentarioDiv);
    comentarioDiv.appendChild(recuadroComentarioDiv);
    divOculto.parentNode.insertBefore(comentarioDiv, divOculto.nextSibling);
}