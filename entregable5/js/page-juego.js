"use strict";

import { pauseGame, resumeGame, resetGame, isGameOver } from "./flappy/flappy-game.js";

document.addEventListener("DOMContentLoaded", () => {

    /* ========================================
       ELEMENTOS GENERALES DEL DOM
    ======================================== */
    const formComentario = document.getElementById("comentar");
    const textareaComentario = formComentario?.querySelector("textarea");
    const btnCancelar = formComentario?.querySelector(".btn-cancelar");

    const btnLeerMas = document.querySelector(".btn-leer-mas");
    const btnLeerMenos = document.querySelector(".btn-leer-menos");

    const botonesLike = document.querySelectorAll(".btn-like");
    const botonesDislike = document.querySelectorAll(".btn-dislike");

    const btnCompartir = document.getElementById("btnCompartir");
    const btnRanking = document.getElementById("btnRanking");
    const popAppCompartir = document.querySelector(".section-compartir");
    const popAppRanking = document.querySelector(".section-ranking");

    const btnFullscreen = document.getElementById("ingame-fullscreen-button");
    const blur = document.querySelector(".blur");
    const btnJugarPagina = document.querySelector(".btn-jugar");
    const imgJuego = document.querySelector(".img-juego");

    /* ========================================
       ELEMENTOS DEL JUEGO
    ======================================== */
    const mainMenu = document.getElementById("main-menu");
    const mainBtnJugar = document.getElementById("main-menu-jugar");
    const mainBtnOpciones = document.getElementById("main-menu-opciones");
    const mainBtnSalir = document.getElementById("main-menu-salir");

    const ingameControls = document.getElementById("ingame-controls");
    const ingameMenu = document.getElementById("ingame-menu");
    const btnPausa = document.getElementById("ingame-pause-button");
    const btnMenu = document.getElementById("ingame-menu-button");

    const btnReanudar = document.getElementById("ingame-menu-reanudar");
    const btnReiniciar = document.getElementById("ingame-menu-reiniciar");
    const btnVolver = document.getElementById("ingame-menu-volver");

    const gameOverMenu = document.getElementById("game-over-menu");
    const gameOverReiniciar = document.getElementById("game-over-reiniciar");
    const gameOverVolver = document.getElementById("game-over-volver");

    const gameWinMenu = document.getElementById("game-win-menu");
    const gameWinReiniciar = document.getElementById("game-win-reiniciar");
    const gameWinVolver = document.getElementById("game-win-volver");

    const flappyGame = document.getElementById("flappy-bird-game");

    gameOverReiniciar?.addEventListener("click", () => {
    // Ocultar ambos menús por si acaso
    gameOverMenu.classList.add("oculto");
    gameWinMenu.classList.add("oculto");

    startGameMode(); // reinicia el juego correctamente
});

gameWinReiniciar?.addEventListener("click", () => {
    // Ocultar ambos menús por si acaso
    gameWinMenu.classList.add("oculto");
    gameOverMenu.classList.add("oculto");

    startGameMode(); // reinicia el juego correctamente
});

gameOverVolver?.addEventListener("click", () => {
    // Oculto todos los menús del juego
    gameOverMenu.classList.add("oculto");
    gameWinMenu.classList.add("oculto");
    ingameMenu.classList.add("oculto");
    ingameControls.classList.add("oculto");
    flappyGame.classList.add("oculto");

    // Muestro el menú principal
    mainMenu.classList.remove("oculto");
});

gameWinVolver?.addEventListener("click", () => {
    // Oculto todos los menús del juego
    gameWinMenu.classList.add("oculto");
    gameOverMenu.classList.add("oculto");
    ingameMenu.classList.add("oculto");
    ingameControls.classList.add("oculto");
    flappyGame.classList.add("oculto");

    // Muestro el menú principal
    mainMenu.classList.remove("oculto");
});

    /* ========================================
       FUNCIONES DEL JUEGO
    ======================================== */

    function startGameMode() {
        mainMenu?.classList.add("oculto");
        ingameMenu?.classList.add("oculto");

        flappyGame.classList.remove("oculto");
        ingameControls.classList.remove("oculto");

        resetGame(); // inicia el juego limpio
    }

    function goBackToStartScreen() {
        flappyGame.classList.add("oculto");
        ingameControls.classList.add("oculto");
        mainMenu.classList.add("oculto");
        ingameMenu.classList.add("oculto");

        blur.classList.remove("oculto");
        btnJugarPagina.classList.remove("oculto");
        imgJuego?.classList.remove("oculto");
    }

    function goBackToMainMenu() {
        flappyGame.classList.add("oculto");
        ingameControls.classList.add("oculto");
        ingameMenu.classList.add("oculto");

        mainMenu.classList.remove("oculto");
    }

    /* ========================================
       EVENTOS PANTALLA INICIAL
    ======================================== */

    btnJugarPagina?.addEventListener("click", () => {
        btnJugarPagina.classList.add("oculto");
        blur.classList.add("oculto");
        imgJuego?.classList.add("oculto");

        mainMenu.classList.remove("oculto");
    });

    /* ========================================
       EVENTOS MENÚ PRINCIPAL DEL JUEGO
    ======================================== */

    mainBtnJugar?.addEventListener("click", startGameMode);

    mainBtnSalir?.addEventListener("click", goBackToStartScreen);

    mainBtnOpciones?.addEventListener("click", () => {
        alert("Opciones no implementadas aún.");
    });

    /* ========================================
       CONTROLES IN-GAME
    ======================================== */

    btnPausa.addEventListener("click", () => {
        if (isGameOver()) return;
        ingameMenu.classList.remove("oculto");
        pauseGame();
    });

    btnMenu?.addEventListener("click", () => {
        ingameMenu.classList.toggle("oculto");
    });

    /* ========================================
       MENÚ IN-GAME
    ======================================== */

    btnReanudar?.addEventListener("click", () => {
        ingameMenu.classList.add("oculto");
        resumeGame();
    });

    btnReiniciar?.addEventListener("click", () => {
        ingameMenu.classList.add("oculto");
        startGameMode();
    });

    btnVolver?.addEventListener("click", () => {
        goBackToMainMenu();
    });

    document.addEventListener("gameOver", () => {
        ingameMenu.classList.add("oculto");
        ingameControls.classList.add("oculto");
        gameOverMenu.classList.remove("oculto");
    });

    /* ========================================
       FORMULARIO DE COMENTARIOS
    ======================================== */

    formComentario?.addEventListener("submit", postComentario);
    btnCancelar?.addEventListener("click", vaciarFormulario);
    textareaComentario?.addEventListener("input", activarBotones);

    btnLeerMas?.addEventListener("click", toggleLeerMas);
    btnLeerMenos?.addEventListener("click", toggleLeerMas);

    botonesLike.forEach(boton => boton.addEventListener("click", botonLikeDislike));
    botonesDislike.forEach(boton => boton.addEventListener("click", botonLikeDislike));

    btnCompartir?.addEventListener("click", tooglePopApp);
    btnRanking?.addEventListener("click", tooglePopApp);

    document.addEventListener("click", (e) => {
        if (popAppCompartir && !btnCompartir.contains(e.target)) {
            popAppCompartir.classList.add("oculto");
        }
        if (popAppRanking && !btnRanking.contains(e.target)) {
            popAppRanking.classList.add("oculto");
        }
    });

    /* ========================================
       ANIMACIÓN CORAZÓN (FAVORITOS)
    ======================================== */

    const btnFavoritos = document.getElementById("btnFavoritos");
    const favsIconBtn = document.querySelector(".header-right .icon-btn.favs");

    btnFavoritos?.addEventListener("click", () => {
        if (btnFavoritos && favsIconBtn) {
            crearCorazonVolador(btnFavoritos, favsIconBtn);
        }
    });

    /* ========================================
       FULLSCREEN
    ======================================== */

    btnFullscreen?.addEventListener("click", () => {
        if (!document.fullscreenElement) {
            document.getElementById("game-container").requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    });
});

/* ===========================
   RESTO DE FUNCIONES ORIGINALES
=========================== */

function tooglePopApp(event) {
    const btn = event.currentTarget;
    let popApp;

    if (btn.classList.contains("compartir")) {
        popApp = document.querySelector(".section-compartir");
    } else {
        popApp = document.querySelector(".section-ranking");
    }

    popApp.classList.toggle("oculto");
}

function toggleLeerMas(event) {
    let btnLeerMasEl = event.target;
    const comentario = btnLeerMasEl.closest(".comentario");

    const btnLeerMenos = comentario.querySelector(".btn-leer-menos");
    const btnLeerMas = comentario.querySelector(".btn-leer-mas");
    const textoComentado = comentario.querySelector(".texto-comentado");

    textoComentado.classList.toggle("texto-comentado-activo");
    btnLeerMas.classList.toggle("oculto");
    btnLeerMenos.classList.toggle("oculto");
}

function postComentario(event) {
    event.preventDefault();

    const formComentario = document.getElementById("comentar");
    const textarea = formComentario.querySelector("textarea");

    if (textarea.value.trim() !== "") {
        const nombreUsuario = document.querySelector(".comentar .nombre-usuario h4").textContent;
        const avatarSrc = document.querySelector(".comentar .avatar-comentario img").src;

        const nuevoComentarioTexto = textarea.value;

        const fechaActual = new Date().toLocaleDateString("es-ES", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });

        const seccionComentarios = document.querySelector(".comentarios");
        const divOculto = seccionComentarios.querySelector(".comentario.oculto");

        crearYAgregarComentario(nuevoComentarioTexto, nombreUsuario, avatarSrc, fechaActual, 0, 0, divOculto);

        formComentario.reset();
        activarBotones({ target: textarea });
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
    event.preventDefault();

    const formComentario = document.getElementById("comentar");
    const textarea = formComentario.querySelector("textarea");

    if (textarea.value.trim() !== "") {
        formComentario.reset();
        activarBotones({ target: textarea });
    }
}

function botonLikeDislike(event) {
    let btn = event.currentTarget;

    const comentario = btn.closest(".comentario");

    let contador;
    let otroContador;

    let imgLike = comentario.querySelector(".btnLike");
    let imgDislike = comentario.querySelector(".btnDislike");

    if (btn.classList.contains("btn-like")) {
        contador = comentario.querySelector(".cont-like");
        otroContador = comentario.querySelector(".cont-dislike");

        if (contador.dataset.value === "active") {
            manejarContadorMenos(contador);
            contador.dataset.value = "inactive";
            imgLike.classList.toggle("btnLike-active");
        } else {
            manejarContadorMas(contador);
            contador.dataset.value = "active";

            if (otroContador.dataset.value === "active") {
                manejarContadorMenos(otroContador);
                otroContador.dataset.value = "inactive";
                imgDislike.classList.toggle("btnDislike-active");
            }

            imgLike.classList.toggle("btnLike-active");
        }
    } else {
        contador = comentario.querySelector(".cont-dislike");
        otroContador = comentario.querySelector(".cont-like");

        if (contador.dataset.value === "active") {
            manejarContadorMenos(contador);
            contador.dataset.value = "inactive";
            imgDislike.classList.toggle("btnDislike-active");
        } else {
            manejarContadorMas(contador);
            contador.dataset.value = "active";

            if (otroContador.dataset.value === "active") {
                manejarContadorMenos(otroContador);
                otroContador.dataset.value = "inactive";
                imgLike.classList.toggle("btnLike-active");
            }

            imgDislike.classList.toggle("btnDislike-active");
        }
    }

    function manejarContadorMas(cont) {
        if (cont.textContent === "") cont.textContent = 1;
        else cont.textContent = parseInt(cont.textContent) + 1;
    }

    function manejarContadorMenos(cont) {
        let valor = parseInt(cont.textContent);
        if (valor === 1) cont.textContent = "";
        else if (valor > 1) cont.textContent = valor - 1;
    }
}

function crearYAgregarComentario(texto, nombre, avatar, fecha, likesIniciales = 0, dislikesIniciales = 0, divOculto) {
    const MAX_CARACTERES = 130;
    const necesitaLeerMas = texto.length > MAX_CARACTERES;

    const comentarioDiv = document.createElement("div");
    comentarioDiv.className = "comentario";

    const userComentarioDiv = document.createElement("div");
    userComentarioDiv.className = "user-comentario";

    const avatarComentarioDiv = document.createElement("div");
    avatarComentarioDiv.className = "avatar-comentario";

    const imgAvatar = document.createElement("img");
    imgAvatar.src = avatar;
    imgAvatar.alt = "Imagen de usuario";
    imgAvatar.className = "img-foto-comentarios";

    avatarComentarioDiv.appendChild(imgAvatar);

    const nombreUsuarioDiv = document.createElement("div");
    nombreUsuarioDiv.className = "nombre-usuario";

    const h4Nombre = document.createElement("h4");
    h4Nombre.textContent = nombre;

    nombreUsuarioDiv.appendChild(h4Nombre);

    userComentarioDiv.appendChild(avatarComentarioDiv);
    userComentarioDiv.appendChild(nombreUsuarioDiv);

    const recuadroComentarioDiv = document.createElement("div");
    recuadroComentarioDiv.className = "recuadro-comentario";

    const textoComentadoDiv = document.createElement("div");
    textoComentadoDiv.className = "texto-comentado";

    if (!necesitaLeerMas) {
        textoComentadoDiv.classList.add("texto-comentado-activo");
    }

    const pTexto = document.createElement("p");
    pTexto.textContent = texto;

    const pFecha = document.createElement("p");
    pFecha.className = "fecha-comentario";
    pFecha.textContent = fecha;

    const btnsComentariosDiv = document.createElement("div");
    btnsComentariosDiv.className = "btns-comentarios";

    function crearBotonContador(tipo, count) {
        const itemBtnDiv = document.createElement("div");
        itemBtnDiv.className = "item-btn-comentario";

        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = tipo === "like" ? "btn-like" : "btn-dislike";
        btn.addEventListener("click", botonLikeDislike);

        const img = document.createElement("div");
        img.className = tipo === "like" ? "btnLike" : "btnDislike";

        btn.appendChild(img);

        const pCont = document.createElement("p");
        pCont.className = tipo === "like" ? "cont-like" : "cont-dislike";
        pCont.textContent = count > 0 ? count : "";
        pCont.dataset.value = "inactive";

        itemBtnDiv.appendChild(btn);
        itemBtnDiv.appendChild(pCont);

        return itemBtnDiv;
    }

    btnsComentariosDiv.appendChild(crearBotonContador("like", likesIniciales));
    btnsComentariosDiv.appendChild(crearBotonContador("dislike", dislikesIniciales));

    textoComentadoDiv.appendChild(pTexto);

    if (necesitaLeerMas) {
        const btnComentarioDiv = document.createElement("div");
        btnComentarioDiv.className = "btn-comentario";

        const btnLeerMas = document.createElement("button");
        btnLeerMas.className = "btn-leer-mas";
        btnLeerMas.textContent = "Leer más";
        btnLeerMas.addEventListener("click", toggleLeerMas);

        const btnLeerMenos = document.createElement("button");
        btnLeerMenos.className = "btn-leer-menos oculto";
        btnLeerMenos.textContent = "Leer menos";
        btnLeerMenos.addEventListener("click", toggleLeerMas);

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
