/**
 * Script de Inicialización y Funcionalidad de Carruseles (Carousels)
 *
 * 1. Inicializa los carousels.
 * 2. Asegura que cada carrusel tenga al menos 8 tarjetas clonando las existentes si es necesario.
 * 3. Conecta los botones de navegación (prev/next) para el desplazamiento.
 * 4. Añade control por teclado a los botones.
 */
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
            e.preventDefault();
        }, { passive: false }); // `passive: false` es necesario para que `preventDefault` funcione

        // Previene el desplazamiento táctil
        g.addEventListener('touchmove', e => {
            e.preventDefault();
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
