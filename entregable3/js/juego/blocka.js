"use strict";
import Figura from "./figura.js";
import Imagen from "./Imagen.js";
import Filtro from './filtros/filtro.js';
import FiltroNegativo from './filtros/filtroNegativo.js';
import FiltroGrises from './filtros/filtroEscalaDeGrises.js';
import FiltroBrillo30 from './filtros/filtroBrillo30.js';
import Cronometro from "./cronometro/cronometro.js";
import CuentaRegresiva from "./cronometro/cuentaRegresiva.js";

/** @type { HTMLCanvasElement} */
let canvas = document.getElementById("canvas-game");
/** @type { CanvasRenderingContext2D } */
let ctx = canvas.getContext("2d");

let gameWidth = canvas.width;
let gameHeight = canvas.height;

// --- Variables Globales ---
const imagenesDistintas = []; // contiene objetos Image cargados
let figuras = [];
let cronometro = new Cronometro();
let dificultad = null;
let nivel = null;
let currentLevelIndex = 0;
let currentDifficultyString = 'facil';
let isPaused = false;
let animationFrameId = null;
let ayuditaUsada = false;

let sonidoFondo = null;
let sonidoRisa = null;
let sonidoVictoria = null;

let enemigo = false;

const URL_API = "https://68f1750cb36f9750dee95a6b.mockapi.io/api/blockapi/Timers";

// --- DOM Elements ---
const gameContainer = document.getElementById("game-container");
const carruselContainer = gameContainer.querySelector(".contenedor-carrusel");
const carruselImagenes = carruselContainer.querySelector(".contenedor-imagenes");
const mainMenu = document.getElementById("main-menu");
const levelMenu = document.getElementById("level-menu");
const difficultyMenu = document.getElementById("difficulty-menu");
const optionsMenu = document.getElementById("options-menu");
const rankingDisplay = document.getElementById("ranking-display");
const rankingList = document.getElementById("ranking-list");
const volumeSlider = document.getElementById("volume-slider");
const pauseButton = document.getElementById("pause-button");
const ingameMenuButton = document.getElementById("ingame-menu-button");
const ingameMenu = document.getElementById("ingame-menu");
const pauseOverlay = document.getElementById("pause-overlay");
const winMessage = document.getElementById("win-message");
const winMenu = document.getElementById("win-menu");
const loseMessage = document.getElementById("lose-message");
const loseMenu = document.getElementById("lose-menu");

/**
 * funcion inicial llamada por page-juego.js
 * la cambie a async para que espere a que las imagenes  se carguen
 */
export async function inicializarJuego() {
    try {
        await cargarImagenes(); // espera a que todas las imágenes base se carguen
        setupMenuListeners(); //llama a setupMenuListeners para que los botones de los menu funcionen.
    } catch (error) {
        console.error("Error fatal al inicializar el juego:", error);
    }
}

/* devuelve una promise que se resuelve cuando todas las imágenes están cargadas.*/
function cargarImagenes() {
    if (imagenesDistintas.length > 0) return Promise.resolve();
    //defino las rutas de todas las imagenes de los niveles.
    const paths = [
        "resourses/images/metalAuto6.png",
        "resourses/images/el-hombre-que-araña.png",
        "resourses/images/llamado-a-don-ramon.png",
        "img/peak.jpg",
        "img/mgs-blocka.png",
        "img/fnv-blocka3.png"
    ];

    // creo un array de promesas, por cada ruta crea un new Image y devuelve la promesa
    // cuando la imagen termina de cargar
    const promises = paths.map(src => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = src;
            img.onload = () => resolve(img);
            img.onerror = () => {
                console.error(`Error al cargar la imagen: ${src}`);
                reject(new Error(`Error al cargar la imagen: ${src}`));
            };
        });
    });

    return Promise.all(promises).then(images => { //espera a que todas las imagenes terminen de cargarse
        imagenesDistintas.push(...images); // cuando estan listas, agrega las imágenes cargadas al array
    });
}

// --- Lógica Principal del Juego ---

/*es async para esperar a cantidadFiguras. Configura el estado del juego (cual nivel, dificultad, etc).*/
async function iniciarNivel(index, partes = 2, filtro, tiempo = null) {
    nivel = index + 1;
    currentLevelIndex = index;
    ayuditaUsada = false;

    ocultarTodosLosMenus();
    canvas.classList.remove("oculto");

    pauseButton.classList.remove("oculto");
    ingameMenuButton.classList.remove("oculto");

    // crea la instancia nueva del cronometro
    if (dificultad === 'facil') {
        cronometro = new Cronometro();
    } else {
        cronometro = new CuentaRegresiva(tiempo || 30);
    }

    //llama a la función que crea todas las piezas (Figura) y sus imágenes (Imagen). 
    //espera a que todas estén creadas y con el filtro aplicado.
    figuras = await cantidadFiguras(partes, 2, imagenesDistintas[index], filtro);

    if (figuras.length === 0) {
        console.error("No se pudieron crear las figuras. Volviendo al menú.");
        volverAlMenuPrincipal();
        return;
    }

    canvas.removeEventListener('mousedown', eventoClick);
    canvas.removeEventListener('contextmenu', preventContextMenu);
    canvas.addEventListener('mousedown', eventoClick);
    canvas.addEventListener('contextmenu', preventContextMenu);

    rotarFiguras(figuras);//desordena las piezas

    if (typeof cronometro.reiniciar === 'function') {
        cronometro.reiniciar();
    } else if (cronometro instanceof CuentaRegresiva) {
        cronometro.tiempoRestante = cronometro.tiempoInicial;
    }

    if (sonidoFondo) sonidoFondo.pause();
    sonidoFondo = reproducirSonido("resourses/sounds/soundtrack.mp3", true, parseFloat(volumeSlider.value));

    isPaused = false; //asegura que no inicie pausado

    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    gameLoop();
}

function preventContextMenu(e) { e.preventDefault(); }

/**
 * Bucle principal del juego
 */
function gameLoop() {
    if (isPaused) { //si el juego esta pausado vuelve a pedirse a si misma
        animationFrameId = requestAnimationFrame(gameLoop);
        return;
    }

    dibujarFiguras();//limpia el lienzo y dibuja todas las piezas en su posición y rotación actual.
    if (typeof cronometro.mostrarTiempo === 'function') { cronometro.mostrarTiempo(); }//actualiza el texto del contador

    if (typeof cronometro.finalizo === 'function' && cronometro.finalizo()) {//va a ser True si es cuentaRegresiva y llego a 0
        mostrarMenuPerder();
        return;
    }

    let gano = true;

    for (let figura of figuras) { //se fija si alguna figura quedo mal, si es asi pasa a False
        if (!figura.posicionCorrecta()) {
            gano = false; break; 
        } 
    }

    if (gano) {
        for (let figura of figuras) { figura.resueltaConAyuda = false; }
        mostrarVictoria();
        enemigo = false
        // envía resultado si hay un tiempo que guardar (si gano)
        if (typeof cronometro.getTiempoFinal === 'function' || typeof cronometro.getTiempoTranscurrido === 'function' || cronometro instanceof Cronometro) {
            enviarResultado();
        }
        return;
    }

    //le dice al navegador que vuelva a llamar a gameLoop en el próximo "frame" disponible. 
    //esto es lo que crea la animación fluida.
    animationFrameId = requestAnimationFrame(gameLoop);
}

/* limpia el canvas y dibuja las figuras, aplicando el tinte verde si es necesario.
 * la lógica del tinte verde se movió a figura.rotarFigura().*/
function dibujarFiguras() {
    ctx.clearRect(0, 0, gameWidth, gameHeight);
    for (let i = 0; i < figuras.length; i++) {
        let figura = figuras[i];
        figura.rotarFigura(); // la figura ahora se dibuja a sí misma, incluido el tinte
    }
}

/*es async y espera a que los sprites se inicialicen.*/
async function cantidadFiguras(cantW, cantH, image, filtro, espacio = 30, color = "rgba(236, 195, 125, 1)", posX = 400, posY = 250) {
    let figArray = [];
    if (!image || !image.complete || image.naturalWidth === 0 || image.naturalHeight === 0) {
        console.error("Imagen inválida o no cargada en cantidadFiguras:", image ? image.src : 'undefined');
        return figArray; // devolver vacío si la imagen no está lista
    }

    let anchoFijo = image.naturalWidth / cantW;
    let altoFijo = image.naturalHeight / cantH;
    
    let spritePromises = []; // almacena las promesas de inicialización de los sprites

    for (let i = 0; i < cantW; i++) {
        for (let j = 0; j < cantH; j++) {
            const sprite = new Imagen( //recorte de la imagen original
                image.src, i * anchoFijo, j * altoFijo, anchoFijo, altoFijo, seleccionarFiltro(filtro)
            );
            
            let figura = new Figura( //le da su posicion en la pantalla y le pasa el sprite (imagen)
                posX + i * (anchoFijo + espacio), posY + j * (altoFijo + espacio),
                anchoFijo, altoFijo, color, sprite, ctx, i, j
            );
            
            // agrega la promesa de inicialización del sprite al array
            figArray.push(figura);
            // guarda la promesa sprite.initialize() (que carga y filtra la imagen del sprite)
            spritePromises.push(sprite.initialize());
        }
    }

    try {
        // espera a que todos los sprites se carguen y apliquen sus filtros
        await Promise.all(spritePromises);
    } catch (error) {
        console.error("Error al inicializar uno o más sprites:", error);
        return []; // devuelve array vacío si falla la carga
    }
    
    return figArray;
}


function eventoClick(event) {
    if (isPaused) return;
    const boton = event.button;
    if (boton !== 0 && boton !== 2) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const mouseX = (event.clientX - rect.left) * scaleX;
    const mouseY = (event.clientY - rect.top) * scaleY;

    for (let i = figuras.length - 1; i >= 0; i--) {
        const figura = figuras[i];
        if (figura.estaDentro(mouseX, mouseY)) { //la logica de esto esta en Figura js
            if (figura.resueltaConAyuda) return;
            // si el click está dentro de una figura y no está bloqueada por la "ayudita" hace:
            if (boton === 0) figura.rotar(-90);
            else if (boton === 2) figura.rotar(90);
            break; // detiene el bulce para rotar una pieza
        }
    }

    if(!enemigo){
        let probabilidad = Math.random();
        if(probabilidad < 0.3){ //30% de probabilidad de activar enemigo
            enemigo = true;
            enemigoRotarPiezas();
            sonidoRisa = reproducirSonido("resourses/sounds/risa.mp3", false, 0.7);
            mostrarEnemigo();
        }
    }
}

function enemigoRotarPiezas(){
    for (let figura of figuras) {
        if(figura.resueltaConAyuda) continue; //no rota las piezas que ya fueron resueltas con ayudita
        figura.rotar(90);
    }
}

function mostrarEnemigo(){
    
    // Cargamos la imagen del enemigo
    const enemigoSVG = new Image();
    enemigoSVG.src = "resourses/images/enemigo.svg";

    // Variables de animación
    let x = gameWidth / 2; // Centro horizontal
    let y = gameHeight + 50; // Comienza fuera del canvas (abajo)
    const velocidad = 5; // Pixeles por frame

    // Cuando la imagen se haya cargado, comenzamos la animación
    enemigoSVG.onload = function () {
        animar();
    };

    function animar() {

        // Dibujar imagen centrada (ajustamos ancho y alto)
        const ancho1 = 50;
        const alto1 = 50;
        ctx.drawImage(enemigoSVG, x - ancho1 / 2, y - alto1 / 2, ancho1, alto1);

        // Actualizar posición Y (sube)
        y -= velocidad;

        // Si todavía no salió por arriba, seguir animando
        if (y + alto1 / 2 > 0) {
            requestAnimationFrame(animar);
        }
    }

}

// --- Manejo de Estado (Pausa, Victoria, Derrota) ---

/*pausa el juego y SIEMPRE intenta pausar el cronómetro.*/

function pausarJuego() {
    if (isPaused) return; // evita doble pausa
    isPaused = true;
    pauseOverlay.classList.remove("oculto");
    // intenta pausar cualquier tipo de cronómetro
    if (cronometro && typeof cronometro.pausar === 'function') {
        cronometro.pausar();
        console.log("Cronómetro pausado"); // Debug
    } else {
        console.log("Método pausar no encontrado en cronómetro"); // Debug
    }
}

/* reanuda el juego y SIEMPRE intenta reanudar el cronómetro.*/
function reanudarJuego() {
    if (!isPaused) return; // evita doble reanudación
    isPaused = false;
    pauseOverlay.classList.add("oculto");
    ingameMenu.classList.add("oculto");
    // intenta reanudar cualquier tipo de cronómetro
    if (cronometro && typeof cronometro.reanudar === 'function') {
        cronometro.reanudar();
        console.log("Cronómetro reanudado"); // Debug
    } else {
        console.log("Método reanudar no encontrado en cronómetro"); // Debug
    }
}


/* secuencia de victoria con menú retardado. reutiliza las figuras existentes para mostrar la imagen final, en lugar de crear nuevas.
 */
function mostrarVictoria() {
    // detiene el bucle del juego y la música de fondo
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    if (sonidoFondo) sonidoFondo.pause();
    ocultarUIJuego(); // Oculta botones de pausa/menu

    // encontrar la figura base (i=0, j=0)
    const figBase = figuras.find(f => f.i === 0 && f.j === 0);
    
    if (!figBase) {
        console.error("No se encontró la figura base para la animación.");
        // Fallback (comportamiento antiguo)
        winMessage.classList.remove("oculto");
        winMenu.classList.remove("oculto");
        return;
    }

    const basePosX = figBase.getPosX(); // posición X de la pieza ancla
    const basePosY = figBase.getPosY(); // posición Y de la pieza ancla

    // prepara figuras para la animación
    // guardamos su pos inicial y calculamos la final.

    const animationProps = [];
    for (const fig of figuras) {
        fig.angulo = 0; // poner en ángulo correcto
        fig.getSprite().sacarFiltro(); // sacar filtro
        fig.unida = true; // marcar como "unida" (oculta el borde)

        // guardar estado inicial y final
        animationProps.push({
            fig: fig,
            startX: fig.getPosX(),
            startY: fig.getPosY(),
            endX: basePosX + fig.i * fig.getAncho(), // posición X final (sin espacios)
            endY: basePosY + fig.j * fig.getAlto()   // posición Y final (sin espacios)
        });
    }
    
    // inicia la animación
    const duration = 1000; // 1 segundo de animación
    let startTime = null;

    // función de interpolación (Lerp) para mover un poquito cada figura desde su startX a su endX en cada frame
    function lerp(start, end, t) {
        return start * (1 - t) + end * t;
    }

    function animateWin(timestamp) {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        //  calcula el progreso de la animacion, 'progress' va de 0.0 a 1.0
        const progress = Math.min(1, elapsed / duration); 

        // aca se llama a lerp, actualiza la posición de cada figura
        for (const prop of animationProps) {
            const currentX = lerp(prop.startX, prop.endX, progress);
            const currentY = lerp(prop.startY, prop.endY, progress);
            prop.fig.setPosX(currentX);
            prop.fig.setPosY(currentY);
        }

        // volver a dibujar en la nueva posicion
        dibujarFiguras(); 

        // continuar o terminar
        if (progress < 1) {
            // siguiente frame
            animationFrameId = requestAnimationFrame(animateWin);
        } else {
            // animación terminada
            onAnimationComplete();
        }
    }

    // iniciar el primer frame de la animación de victoria
    animationFrameId = requestAnimationFrame(animateWin);
    sonidoVictoria = reproducirSonido("resourses/sounds/victory.mp3", false, 0.7);
}

function onAnimationComplete() {
    // espera 1 segundo, despues muestra "Ganaste"
    setTimeout(() => {
        winMessage.classList.remove("oculto");

        // espera 2 segundos más, despues muestra el menú
        setTimeout(() => {
            winMenu.classList.remove("oculto");
            const nextLevelBtn = document.getElementById("win-next-level");
            nextLevelBtn.disabled = (currentLevelIndex >= imagenesDistintas.length - 1);
            nextLevelBtn.innerText = nextLevelBtn.disabled ? "Fin del Juego" : "Próximo Nivel";
        }, 2000); // 2 segundos para el menú

    }, 1000); // 1 segundo para el mensaje "Ganaste"
}


function mostrarMenuPerder() {
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    if (sonidoFondo) sonidoFondo.pause();
    ocultarUIJuego();
    loseMessage.classList.remove("oculto");
    loseMenu.classList.remove("oculto");
    enemigo = false;
}

/**
 * Lógica de Ayudita.
 */
function darAyudita() {
    if (isPaused || ayuditaUsada) return;

    let piezaResuelta = false;
    for (let fig of figuras) {
        if (!fig.posicionCorrecta() && !fig.resueltaConAyuda) { //ecnuentra la primer pieza que no este correcta
            fig.angulo = 0; // pone la figura en el ángulo correcto (0)
            if (fig.posicionCorrecta()) { // doble check
                fig.resueltaConAyuda = true; // la marca como correcta, la pinta de verde y no se puede clicekar
                ayuditaUsada = true;
                piezaResuelta = true;
                if (dificultad !== 'facil') { // si no es facil le resta 5 segundos al cronometro
                    if (cronometro instanceof CuentaRegresiva) {
                        if (cronometro.tiempoRestante !== undefined) {
                            cronometro.tiempoRestante = Math.max(0, cronometro.tiempoRestante - 5);
                        } else if (typeof cronometro.restarTiempo === 'function') {
                            cronometro.restarTiempo(5);
                        }
                    }
                }
                ingameMenu.classList.add("oculto");
                // no necesita redibujar aca, gameLoop lo hace
                break;
            } else {
                console.warn("Ayudita: Poner ángulo 0 no resolvió la figura.");
            }
        }
    }
}


function volverAlMenuPrincipal() {
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    if (sonidoFondo) sonidoFondo.pause();
    ocultarUIJuego();
    ocultarTodosLosMenus();
    ctx.clearRect(0, 0, gameWidth, gameHeight);
    canvas.classList.add("oculto");
    mainMenu.classList.remove("oculto");
    figuras = [];
    enemigo = false;
}

// --- Lógica del Carrusel ---

function crearImagenesHTML() {
    carruselImagenes.innerHTML = '';
    imagenesDistintas.forEach(img => {
        let imgElement = document.createElement("img");
        imgElement.src = img && img.src ? img.src : '';
        imgElement.classList.add("seleccionable");
        imgElement.style.width = '500px'; imgElement.style.height = '281px'; // forzar tamaño
        imgElement.loading = 'lazy'; // ayuda a la performance
        imgElement.onerror = () => console.error("Error cargando imagen carrusel:", imgElement.src);
        carruselImagenes.appendChild(imgElement);
    });
}

/* Lógica del carrusel para asegurar centrado y foco final.*/

function rotarCarrusel() {
    carruselContainer.classList.remove("oculto");
    const imagenesDOM = carruselImagenes.querySelectorAll('.seleccionable');
    if (imagenesDOM.length === 0) { console.error("Carrusel sin imágenes DOM"); return; }

    let index = 0;

    function centrarImagen(idx, enfocar = false) {
        idx = ((idx % imagenesDOM.length) + imagenesDOM.length) % imagenesDOM.length;
        
        const anchoContenedor = carruselContainer.offsetWidth;
        const anchoImagen = 500; // ancho fijo CSS
        const espacioTotal = 40; // margen total

        // calcular el desplazamiento ideal para centrar (siempre)
        let desplazamiento = (anchoImagen + espacioTotal) * idx - (anchoContenedor / 2 - anchoImagen / 2);

        // aplicar los límites (clamping) SOLO si NO es el paso final de enfocar
        if (!enfocar) {
            const minDesplazamiento = 0; // no se puede scrollear más a la izquierda que el inicio
            
            // ancho total del contenido (N * (ancho + espacio)) - espacio
            const totalWidth = (anchoImagen + espacioTotal) * imagenesDOM.length - espacioTotal;
            
            // el desplazamiento máximo (no puede ser negativo si hay pocas imágenes)
            const maxDesplazamiento = Math.max(0, totalWidth - anchoContenedor);

            // aplicar los límites
            desplazamiento = Math.max(minDesplazamiento, Math.min(desplazamiento, maxDesplazamiento));
        }

        carruselImagenes.style.transform = `translateX(${-desplazamiento}px)`;
        
        // aplica clase 'activa' solo si 'enfocar' es true
        imagenesDOM.forEach((img, i) => img.classList.toggle('activa', enfocar && i === idx));
        index = idx;
    }

    centrarImagen(0, false); // estado inicial

    const randomIndex = Math.floor(Math.random() * imagenesDOM.length); //elige una imagen al azar
    const vueltasCompletas = imagenesDOM.length * 2;
    const indexFinalAnimacion = vueltasCompletas + randomIndex;
    let pasoActual = 0;
    let timeoutId = null; 

    function siguientePasoAnimacion() {
        if (pasoActual > indexFinalAnimacion) {
            requestAnimationFrame(() => {
                centrarImagen(randomIndex, true); // centra Y enfoca
                timeoutId = setTimeout(() => {
                    carruselContainer.classList.add("oculto");
                    carruselImagenes.style.transform = '';
                    seleccionarDificultad(currentDifficultyString, randomIndex);
                }, 1500); // 1,5 segs de pausa
            });
            return; // termina la animación
        }

        let indiceVisual = pasoActual % imagenesDOM.length;
        centrarImagen(indiceVisual, false); // centra sin enfocar

        let duracionSiguientePaso = 100;
        if (pasoActual > indexFinalAnimacion - imagenesDOM.length) { // ultima vuelta
            duracionSiguientePaso = 100 + (pasoActual - (indexFinalAnimacion - imagenesDOM.length)) * 50; // desacelera
        }

        pasoActual++;
        timeoutId = setTimeout(siguientePasoAnimacion, duracionSiguientePaso);
    }

    requestAnimationFrame(() => {
        timeoutId = setTimeout(siguientePasoAnimacion, 100);
    });
}


function iniciarCarruselDeSeleccion(difficulty) { //se llama cuando se elige la dificultad, despues rota el carruser
    currentDifficultyString = difficulty;
    ocultarTodosLosMenus();
    crearImagenesHTML();
    requestAnimationFrame(() => {
        requestAnimationFrame(rotarCarrusel);
    });
}


// --- Funciones de Menús y Listeners --- 
function setupMenuListeners() {
    // Menú Principal
    document.getElementById("btn-menu-jugar").addEventListener("click", () => {
        mainMenu.classList.add("oculto"); levelMenu.classList.remove("oculto");
    });
    document.getElementById("btn-menu-opciones").addEventListener("click", () => {
        mainMenu.classList.add("oculto"); optionsMenu.classList.remove("oculto");
    });
    document.getElementById("btn-menu-salir").addEventListener("click", () => location.reload());

    // Menú Niveles
    levelMenu.querySelectorAll("[data-level]").forEach(btn => {
        btn.addEventListener("click", (e) => {
            currentLevelIndex = parseInt(e.target.dataset.level);
            levelMenu.classList.add("oculto"); difficultyMenu.classList.remove("oculto");
        });
    });
    document.getElementById("btn-level-volver").addEventListener("click", () => {
        levelMenu.classList.add("oculto"); mainMenu.classList.remove("oculto");
    });

    // Menú Dificultad
    difficultyMenu.querySelectorAll("[data-difficulty]").forEach(btn => {
        btn.addEventListener("click", (e) => iniciarCarruselDeSeleccion(e.target.dataset.difficulty));
    });
    document.getElementById("btn-difficulty-volver").addEventListener("click", () => {
        difficultyMenu.classList.add("oculto"); levelMenu.classList.remove("oculto");
    });

    // Menú Opciones
    document.getElementById("btn-options-ranking").addEventListener("click", mostrarRanking);
    document.getElementById("btn-options-volver").addEventListener("click", () => {
        optionsMenu.classList.add("oculto"); rankingDisplay.classList.add("oculto"); mainMenu.classList.remove("oculto");
    });
    volumeSlider.addEventListener("input", (e) => {
        if (sonidoFondo) sonidoFondo.volume = parseFloat(e.target.value);
    });

    // Botones En Juego
    pauseButton.addEventListener("click", () => {
        if (isPaused) { reanudarJuego(); } else { pausarJuego(); }
    });
    ingameMenuButton.addEventListener("click", () => ingameMenu.classList.toggle("oculto"));

    // Menú Desplegable En Juego
    document.getElementById("ingame-resume").addEventListener("click", reanudarJuego);
    document.getElementById("ingame-help").addEventListener("click", darAyudita);
    document.getElementById("ingame-to-main").addEventListener("click", volverAlMenuPrincipal);
    document.getElementById("ingame-exit").addEventListener("click", () => location.reload());

    // Menú Victoria
    document.getElementById("win-restart").addEventListener("click", () => {
        ocultarTodosLosMenus(); seleccionarDificultad(currentDifficultyString, currentLevelIndex);
    });
    document.getElementById("win-to-main").addEventListener("click", volverAlMenuPrincipal);
    document.getElementById("win-next-level").addEventListener("click", () => {
        ocultarTodosLosMenus(); seleccionarDificultad(currentDifficultyString, currentLevelIndex + 1);
    });

    // Menú Derrota
    document.getElementById("lose-restart").addEventListener("click", () => {
        ocultarTodosLosMenus(); seleccionarDificultad(currentDifficultyString, currentLevelIndex);
    });
    document.getElementById("lose-to-main").addEventListener("click", volverAlMenuPrincipal);
}


function seleccionarDificultad(dificultadActual, imagenIndex) { //llama a iniciarNivel con los parametros
    if (imagenIndex < 0 || imagenIndex >= imagenesDistintas.length) {
        console.error("Índice de imagen inválido:", imagenIndex); imagenIndex = 0;
    }
    currentDifficultyString = dificultadActual; dificultad = dificultadActual;
    
    // iniciarNivel ahora es async, pero no necesitamos esperarlo aca.
    // se ejecuta en segundo plano.
    switch (dificultadActual) {
        case 'facil': iniciarNivel(imagenIndex, 2, 3); break;
        case 'medio': iniciarNivel(imagenIndex, 3, 2, 60); break;
        case 'dificil': iniciarNivel(imagenIndex, 4, 1, 30); break;
        case 'enemigos': iniciarNivel(imagenIndex, 4, 0, 30); break;
        default: iniciarNivel(imagenIndex, 3, 2); break;
    }
}

function ocultarTodosLosMenus() {
    mainMenu.classList.add("oculto"); levelMenu.classList.add("oculto"); difficultyMenu.classList.add("oculto");
    optionsMenu.classList.add("oculto"); ingameMenu.classList.add("oculto"); winMessage.classList.add("oculto");
    winMenu.classList.add("oculto"); loseMessage.classList.add("oculto"); loseMenu.classList.add("oculto");
    pauseOverlay.classList.add("oculto"); carruselContainer.classList.add("oculto");
}

function ocultarUIJuego() {
    pauseButton.classList.add("oculto"); ingameMenuButton.classList.add("oculto"); ingameMenu.classList.add("oculto");
}

// --- Funciones Utilitarias (filtros, sonido, rotación) --- 
function seleccionarFiltro(number) {
    if (number === 0) {
        number = Math.round(Math.random() * 3 + 1);
    }

    let filtro;
    switch (number) {
        case 1:
            filtro = new FiltroNegativo();
            break;
        case 2:
            filtro = new FiltroGrises();
            break;
        case 3:
            filtro = new FiltroBrillo30();
            break;
        default:
            filtro = new Filtro();
            break;
    }
    return filtro;
}

function rotarFiguras(figuras, grados = 0) {
    let random = 0;
    let nuevoGrado = grados;

    for (let figura of figuras) {
        if (nuevoGrado === 0) {
            grados = 0;
            random = Math.round(Math.random() * 10 + 1);
        }

        if (grados === 0) {
            if (random < 4) {
                grados = -90;
            } else if (random < 7) {
                grados = 90;
            } else {
                grados = 180;
            }
        }
        figura.rotar(grados);
    }
}
/* La función sacarFiltro() del sprite es síncrona.*/

function sacarFiltro(figuras) {
    for (let figura of figuras) {
        figura.getSprite().sacarFiltro();
    }
}

function reproducirSonido(src, loop = true, volumen = 0.1) {
    let sonido = new Audio(src);
    sonido.loop = loop;
    sonido.volume = volumen;
    sonido.play().catch(e => console.warn("Error al reproducir sonido:", e));
    return sonido;
}
// --- Lógica de API (Ranking) ---
async function mostrarRanking() {
    rankingList.innerHTML = "Cargando...";
    rankingDisplay.classList.remove("oculto");
    let rankingsHTML = "";

    try {
        for (let id = 1; id <= 24; id++) {
            const data = await getTiempos(id); //llama a getTiempos para cada ID de nivel/dificultad y construye el html para mostrar los timepos
            
            if (data && data.tiempos && data.tiempos.length > 0) {
                rankingsHTML += `<h5>Nivel ${data.nivel || '?'} - ${data.dificultad || '?'}</h5><ul>`;
                data.tiempos.forEach(t => {
                    rankingsHTML += `<li>${t.nombre}: ${t.tiempo}s</li>`;
                });
                rankingsHTML += "</ul>";
            }
        }
        rankingList.innerHTML = rankingsHTML || "No hay rankings disponibles.";

    } catch (error) {
        console.error("Error al cargar ranking:", error);
        rankingList.innerHTML = "Error al cargar el ranking.";
    }
}

async function enviarResultado() { //se llama al ganar
    let diffIndex = ['facil', 'medio', 'dificil', 'enemigos'].indexOf(dificultad);
    let id = (currentLevelIndex * 4) + diffIndex + 1;
    let nombre = document.getElementById("nombreJugador").textContent || "Jugador";
    let tiempo = 0;

    // busca cómo obtener el tiempo final según el tipo de cronómetro
    if (cronometro instanceof Cronometro) {
        tiempo = cronometro.getTiempoFinal ? cronometro.getTiempoFinal() : (cronometro.tiempo || 0);
    } else if (cronometro instanceof CuentaRegresiva) {
        // calcula tiempo transcurrido
        tiempo = (cronometro.tiempoInicial || 0) - (cronometro.tiempoRestante === undefined ? (cronometro.tiempoInicial || 0) : cronometro.tiempoRestante);
    }

    // asegura >= 0 y redondea
    tiempo = Math.max(0, Math.round(tiempo * 100) / 100);

    let data = await getTiempos(id); //llama a getTiempos para traer la lista actual
    let tiemposLocales = data.tiempos || [];
    
    tiemposLocales.push({ "nombre": nombre, "tiempo": tiempo }); //agrega el nuevo tiempo
    tiemposLocales.sort((a, b) => a.tiempo - b.tiempo); //ordena por mejor tiempo
    
    if (tiemposLocales.length > 8) { //corta la lista para guardar el top 8
        tiemposLocales = tiemposLocales.slice(0, 8);
    }

    const resultado = {
        "nivel": nivel,
        "dificultad": dificultad,
        "tiempos": tiemposLocales
    };

    try {
        const response = await fetch(`${URL_API}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(resultado)
        });

        if (!response.ok) {
            throw new Error(`Error ${response.status} al enviar resultado`);
        }
        
        const dataRes = await response.json();
        console.log("Resultado enviado:", dataRes);

    } catch (error) {
        console.error("Error API Enviar:", error);
    }
}

async function getTiempos(id) { //pide los tiempos a la API
    try {
        const response = await fetch(`${URL_API}/${id}`);
        
        if (response.status === 404) {
            return { tiempos: [] };
        }
        if (!response.ok) {
            throw new Error(`Error ${response.status} al obtener tiempos`);
        }

        const data = await response.json();
        data.tiempos = data.tiempos || [];
        data.tiempos.sort((a, b) => a.tiempo - b.tiempo);
        return data;

    } catch (error) {
        console.error("Error API Get:", error);
        return { tiempos: [] };
    }
}