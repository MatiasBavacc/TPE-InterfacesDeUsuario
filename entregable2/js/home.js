/**
 * Script de Inicialización y Funcionalidad de Carruseles (Carousels)
 *
 * 1. Inicializa los carousels.
 * 2. Asegura que cada carrusel tenga al menos 8 tarjetas clonando las existentes si es necesario.
 * 3. Conecta los botones de navegación (prev/next) para el desplazamiento.
 * 4. Añade control por teclado a los botones.
 */

(function() {
    const heroCarousel = document.querySelector('.hero-carousel');
    
    if (!heroCarousel) return;

    const slidesContainer = heroCarousel.querySelector('.hero-slides-container');
    const prevButton = heroCarousel.querySelector('.carousel-nav.prev');
    const nextButton = heroCarousel.querySelector('.carousel-nav.next');
    const dotsContainer = heroCarousel.querySelector('.carousel-dots');
    const dots = Array.from(dotsContainer.querySelectorAll('.dot'));
    
    // Lista de todos los slides
    const slides = Array.from(slidesContainer.querySelectorAll('.hero-slide'));
    
    // 1. Estado para rastrear el slide actual. Empieza en el slide 0.
    let currentSlideIndex = 0;

    // Función para obtener el ancho de desplazamiento
    function getSlideWidth() {
        // Usa el ancho del contenedor ya que cada slide ocupa el 100% de él.
        return slidesContainer.clientWidth;
    }

    // ----------------------------------------------------------------
    // 2. Función Principal de Navegación (Mueve el carrusel y actualiza los puntos)
    // ----------------------------------------------------------------
    function goToSlide(index) {
        // Asegura que el índice esté dentro de los límites (0 a total de slides - 1)
        if (index < 0) {
            // Ir al último slide si intentamos ir 'antes' del primero
            index = slides.length - 1; 
        } else if (index >= slides.length) {
            // Ir al primer slide si intentamos ir 'después' del último
            index = 0;
        }

        // 3. Calcula la posición de desplazamiento
        const scrollPosition = index * getSlideWidth();
        
        // Desplaza el contenedor
        slidesContainer.scrollTo({ 
            left: scrollPosition, 
            behavior: 'smooth' 
        });
        
        // 4. Actualiza el índice global
        currentSlideIndex = index;

        // 5. Llama a la función para actualizar la UI (los puntos)
        updateDots();
    }

    // ----------------------------------------------------------------
    // 3. Función para Actualizar los Puntos (UI)
    // ----------------------------------------------------------------
    function updateDots() {
        dots.forEach((dot, index) => {
            dot.classList.remove('active');
            if (index === currentSlideIndex) {
                dot.classList.add('active');
            }
        });
    }

    // ----------------------------------------------------------------
    // 4. Listeners para Flechas
    // ----------------------------------------------------------------
    if (prevButton) {
        prevButton.addEventListener('click', () => {
            goToSlide(currentSlideIndex - 1);
        });
    }

    if (nextButton) {
        nextButton.addEventListener('click', () => {
            goToSlide(currentSlideIndex + 1);
        });
    }

    // ----------------------------------------------------------------
    // 5. Listeners para Puntos (Navegación directa)
    // ----------------------------------------------------------------
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            goToSlide(index);
        });
    });

    // ----------------------------------------------------------------
    // 6. Sincronización con Scroll del Usuario (Importante)
    // ----------------------------------------------------------------
    // Si el usuario desplaza el carrusel (por ejemplo, con el tacto o la rueda)
    slidesContainer.addEventListener('scroll', () => {
        // Calcula cuál es el slide más visible (cercano al centro)
        const scrollLeft = slidesContainer.scrollLeft;
        const slideWidth = getSlideWidth();
        
        // Redondea al índice del slide visible
        const newIndex = Math.round(scrollLeft / slideWidth);

        // Si el índice ha cambiado, actualiza los puntos
        if (newIndex !== currentSlideIndex) {
            currentSlideIndex = newIndex;
            updateDots();
        }
    });

    // Inicia el carrusel con el primer dot activo
    updateDots();

})();

(function() {
    // 1. Selección de todos los carousels en la página
    const carousels = document.querySelectorAll('.carousel');

    carousels.forEach(car => {
        const grid = car.querySelector('.game-grid');

        // Salir si no se encuentra la cuadrícula de juegos (game-grid)
        if (!grid) return;

        // --- Lógica de Relleno de Tarjetas (Clonación) ---
        // Asegura que el carrusel tenga al menos 8 tarjetas clonando las existentes
        const cards = Array.from(grid.querySelectorAll('.game-card'));
        let idx = 0;

        while (grid.querySelectorAll('.game-card').length < 8 && cards.length > 0) {
            // Clona un nodo existente y lo añade al final del grid
            const toClone = cards[idx % cards.length].cloneNode(true);
            grid.appendChild(toClone);
            idx++;
        }

        // --- Lógica de Cálculo de Desplazamiento ---
        // Calcula la cantidad de desplazamiento como el ancho de una tarjeta + el gap
        function getScrollAmount() {
            const card = grid.querySelector('.game-card');
            // Retorno de emergencia si no hay tarjetas
            if (!card) return Math.round(grid.clientWidth / 2);

            const style = window.getComputedStyle(grid);
            // Intenta obtener el column-gap o gap, si no, usa un valor predeterminado (20px)
            const gap = parseInt(style.columnGap) || parseInt(style.gap) || 20;

            // Ancho de la tarjeta + gap
            return Math.round(card.getBoundingClientRect().width + gap);
        }

        // --- Lógica de Botones y Navegación ---
        const prev = car.querySelector('.carousel-btn.prev');
        const next = car.querySelector('.carousel-btn.next');

        // Asigna el evento click al botón 'prev'
        if (prev) {
            prev.addEventListener('click', () => {
                grid.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
            });
        }

        // Asigna el evento click al botón 'next'
        if (next) {
            next.addEventListener('click', () => {
                grid.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
            });
        }

        // --- Control de Teclado (Accesibilidad) ---
        // Permite la activación de los botones con Enter o Espacio
        [prev, next].forEach(btn => {
            if (!btn) return;

            btn.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault(); // Evita la acción por defecto del navegador para Espacio
                    btn.click();
                }
            });
        });
    });

})();

// -----------------------------------------------------------------------------
/**
 * Script de Prevención de Desplazamiento Nativo
 *
 * Previene el desplazamiento por rueda de ratón (wheel) o táctil (touchmove)
 * en la cuadrícula del carrusel, asegurando que solo los botones lo controlen.
 */
(function() {
    const grids = document.querySelectorAll('.carousel > .game-grid');

    grids.forEach(g => {
        // Previene el desplazamiento con rueda del ratón
        g.addEventListener('wheel', e => {
            //e.preventDefault();
        }, { passive: false }); // `passive: false` es necesario para que `preventDefault` funcione

        // Previene el desplazamiento táctil
        g.addEventListener('touchmove', e => {
            //e.preventDefault();
        }, { passive: false }); // `passive: false` es necesario para que `preventDefault` funcione
    });
})();

const hamburgerBtn = document.querySelector('.hamburger-menu');
const sidebar = document.getElementById('sidebar');

hamburgerBtn.addEventListener('click', () => {
  sidebar.classList.toggle('active');
});

// Cierra el menú al hacer clic fuera del sidebar
document.addEventListener('click', (e) => {
  const isSidebar = sidebar.contains(e.target);
  const isHamburger = hamburgerBtn.contains(e.target);
  if (!isSidebar && !isHamburger && sidebar.classList.contains('active')) {
    sidebar.classList.remove('active');
  }
});

// Obtener todos los botones de favoritos en las cards
const favButtons = document.querySelectorAll('.boton-fav');

// Recorrer todos los botones encontrados
favButtons.forEach(button => {
    // Añadir un "escuchador" de eventos 'click' a cada botón
    button.addEventListener('click', function() {
        
        // El método .toggle() añade la clase 'activo' si no está,
        // o la quita si ya está, logrando el efecto de encendido/apagado.
        this.classList.toggle('activo'); 
    });
});
