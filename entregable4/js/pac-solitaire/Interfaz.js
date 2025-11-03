export class Interfaz {
    constructor(game) {
        /** @type {import('./Game.js').Game} */
        this.game = game;
        this.canvas = game.canvas;

        this.mainMenu = document.getElementById("main-menu");
        this.difficultyMenu = document.getElementById("difficulty-menu");
        this.optionsMenu = document.getElementById("options-menu");
        this.rankingDisplay = document.getElementById("ranking-display");
        
        this.pauseButton = document.getElementById("pause-button");
        this.ingameMenuButton = document.getElementById("ingame-menu-button");
        this.ingameMenu = document.getElementById("ingame-menu");
        this.pauseOverlay = document.getElementById("pause-overlay");

        this.winMessage = document.getElementById("win-message");
        this.winMenu = document.getElementById("win-menu");
        this.loseMessage = document.getElementById("lose-message");
        this.loseMenu = document.getElementById("lose-menu");
        
        this.setupMenuListeners();
    }

    mostrarPantallaInicio() {
        console.log("Interfaz iniciada. Mostrando menú principal.");
        this.mainMenu.classList.remove("oculto");
    }

    setupMenuListeners() {
        // --- Menú Principal ---
        document.getElementById("btn-menu-jugar").addEventListener("click", () => {
            this.mainMenu.classList.add("oculto");
            this._iniciarPartida();
        });

        document.getElementById("btn-menu-opciones").addEventListener("click", () => {
            this.mainMenu.classList.add("oculto");
            this.optionsMenu.classList.remove("oculto");
        });

        document.getElementById("btn-menu-salir").addEventListener("click", () => {
            location.reload(); 
        });

        // --- Menú Opciones ---
        document.getElementById("btn-options-volver").addEventListener("click", () => {
            this.optionsMenu.classList.add("oculto");
            this.rankingDisplay.classList.add("oculto"); // Oculta el ranking si estaba abierto
            this.mainMenu.classList.remove("oculto");
        });
        
        // --- Botones EN JUEGO ---
        this.pauseButton.addEventListener("click", () => {
            const estaPausado = !this.pauseOverlay.classList.contains("oculto");
            const pauseText = this.pauseOverlay.querySelector('h2');

            if (estaPausado) {
                this.pauseOverlay.classList.add("oculto");
                this.game.reanudar();
            } else {
                if (pauseText) pauseText.classList.remove('oculto');
                this.pauseOverlay.classList.remove("oculto");
                this.game.pausar();
            }
        });

        this.ingameMenuButton.addEventListener("click", () => {
            this.ingameMenu.classList.toggle("oculto");
        });

        // --- Menú Desplegable EN JUEGO ---
        document.getElementById("ingame-resume").addEventListener("click", () => {
             this.pauseOverlay.classList.add("oculto");
             this.ingameMenu.classList.add("oculto");
             this.game.reanudar();
        });
        
        document.getElementById("ingame-to-main").addEventListener("click", () => {
            this.volverAlMenuPrincipal();
        });
        
        document.getElementById("ingame-exit").addEventListener("click", () => {
            location.reload(); 
        });

        document.getElementById("win-restart").addEventListener("click", () => {
            this._iniciarPartida(); // Reinicia el juego
        });
        document.getElementById("win-to-main").addEventListener("click", () => {
            this.volverAlMenuPrincipal();
        });

        // Botones de Derrota
        document.getElementById("lose-restart").addEventListener("click", () => {
            this._iniciarPartida(); // Reinicia el juego
        });
        document.getElementById("lose-to-main").addEventListener("click", () => {
            this.volverAlMenuPrincipal();
        });
        
    }

    //Función privada para ocultar menús e iniciar el juego
    
    _iniciarPartida() {
        this.ocultarTodosLosMenus();
        this.game.reanudar();
        
        // Muestra los botones de control en juego
        this.pauseButton.classList.remove("oculto");
        this.ingameMenuButton.classList.remove("oculto");

        this.canvas.classList.remove("oculto");

        this.game.iniciarJuego();
    }

    ocultarTodosLosMenus() {
        if(this.mainMenu) this.mainMenu.classList.add("oculto");
        if(this.difficultyMenu) this.difficultyMenu.classList.add("oculto");
        if(this.optionsMenu) this.optionsMenu.classList.add("oculto");
        if(this.ingameMenu) this.ingameMenu.classList.add("oculto");
        if(this.winMessage) this.winMessage.classList.add("oculto");
        if(this.winMenu) this.winMenu.classList.add("oculto");
        if(this.loseMessage) this.loseMessage.classList.add("oculto");
        if(this.loseMenu) this.loseMenu.classList.add("oculto");
        if(this.pauseOverlay) this.pauseOverlay.classList.add("oculto");
    }

    volverAlMenuPrincipal() {
        console.log("Volviendo al menú principal...");
        
        this.game.detenerJuego();

        this.ocultarTodosLosMenus();

        this.pauseButton.classList.add("oculto");
        this.ingameMenuButton.classList.add("oculto");
        this.ingameMenu.classList.add("oculto");
        this.pauseOverlay.classList.add("oculto");

        this.canvas.classList.add("oculto");

        this.mainMenu.classList.remove("oculto");
    }

    mostrarVictoria() {
        // Pausa el juego
        this.game.pausar(); 
        
        // Oculta botones de pausa/menu en juego
        this.pauseButton.classList.add("oculto");
        this.ingameMenuButton.classList.add("oculto");
        this.ingameMenu.classList.add("oculto");

        const pauseText = this.pauseOverlay.querySelector('h2');
        if (pauseText) pauseText.classList.add('oculto'); // Oculta el texto "PAUSA"
        this.pauseOverlay.classList.remove('oculto');

        // Muestra el mensaje y el menú de victoria
        this.winMessage.classList.remove("oculto");
        this.winMenu.classList.remove("oculto");
    }

    mostrarDerrota() {
        // Pausa el juego 
        this.game.pausar();

        // Oculta botones de pausa/menu en juego
        this.pauseButton.classList.add("oculto");
        this.ingameMenuButton.classList.add("oculto");
        this.ingameMenu.classList.add("oculto"); 

        const pauseText = this.pauseOverlay.querySelector('h2');
        if (pauseText) pauseText.classList.add('oculto');
        this.pauseOverlay.classList.remove('oculto');

        // Muestra el mensaje y el menú de derrota
        this.loseMessage.classList.remove("oculto");
        this.loseMenu.classList.remove("oculto");
    }
}