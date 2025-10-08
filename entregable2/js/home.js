(function() {
    const heroCarousel = document.querySelector('.hero-carousel');
    
    if (!heroCarousel) return;

    const slidesContainer = heroCarousel.querySelector('.hero-slides-container');
    const prevButton = heroCarousel.querySelector('.carousel-nav.prev');
    const nextButton = heroCarousel.querySelector('.carousel-nav.next');
    const dotsContainer = heroCarousel.querySelector('.carousel-dots');
    const dots = Array.from(dotsContainer.querySelectorAll('.dot'));
    
    const slides = Array.from(slidesContainer.querySelectorAll('.hero-slide'));
    
    // Empieza en el slide 0.
    let currentSlideIndex = 0;

    function getSlideWidth() {
        return slidesContainer.clientWidth;
    }

    // funcion principal de navegacion (Mueve el carrusel y actualiza los puntos)
    function goToSlide(index) {
        // indice dentro de los limites (0 a total de slides - 1)
        if (index < 0) {
            // ir al ultimo slide si intentamos ir 'antes' del primero
            index = slides.length - 1; 
        } else if (index >= slides.length) {
            // ir al primer slide si intentamos ir 'despues' del ultimo
            index = 0;
        }

        // calcula la posicion de desplazamiento
        const scrollPosition = index * getSlideWidth();
        
        // desplaza el contenedor
        slidesContainer.scrollTo({ 
            left: scrollPosition, 
            behavior: 'smooth' 
        });
        
        // actualiza el indice global
        currentSlideIndex = index;

        // llama a la funcion para actualizar la UI (los puntos)
        updateDots();
    }

    // funcion para actualizar los puntos (UI)
    function updateDots() {
        dots.forEach((dot, index) => {
            dot.classList.remove('active');
            if (index === currentSlideIndex) {
                dot.classList.add('active');
            }
        });
    }

    // listeners para flechas
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

    //  listeners para puntos (navegacion directa)
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            goToSlide(index);
        });
    });

    // sincronizacion con scroll del usuario (Importante)
    // ----------------------------------------------------------------
    // si el usuario desplaza el carrusel (por ejemplo, con el tacto o la rueda)
    slidesContainer.addEventListener('scroll', () => {
        // calcula cual es el slide mas visible (cercano al centro)
        const scrollLeft = slidesContainer.scrollLeft;
        const slideWidth = getSlideWidth();
        
        // redondea al indice del slide visible
        const newIndex = Math.round(scrollLeft / slideWidth);

        // si el indice cambio, actualiza los puntos
        if (newIndex !== currentSlideIndex) {
            currentSlideIndex = newIndex;
            updateDots();
        }
    });

    // inicia el carrusel con el primer dot activo
    updateDots();

})();

(function() {
    // seleccion de todos los carruseles en la pagina
    const carousels = document.querySelectorAll('.carousel');

    carousels.forEach(car => {
        const grid = car.querySelector('.game-grid');

        // salir si no se encuentra la cuadricula de juegos (game-grid)
        if (!grid) return;

        // asegura que el carrusel tenga al menos 8 tarjetas clonando las existentes
        const cards = Array.from(grid.querySelectorAll('.game-card'));
        let idx = 0;

        while (grid.querySelectorAll('.game-card').length < 8 && cards.length > 0) {
            // clona un nodo existente y lo añade al final del grid
            const toClone = cards[idx % cards.length].cloneNode(true);
            grid.appendChild(toClone);
            idx++;
        }

        // calcula la cantidad de desplazamiento como el ancho de una tarjeta + el gap
        function getScrollAmount() {
            const card = grid.querySelector('.game-card');
            // retorno de emergencia si no hay tarjetas
            if (!card) return Math.round(grid.clientWidth / 2);

            const style = window.getComputedStyle(grid);
            // intenta obtener el column-gap o gap, si no, usa un valor predeterminado (20px)
            const gap = parseInt(style.columnGap) || parseInt(style.gap) || 20;

            // ancho de la tarjeta + gap
            return Math.round(card.getBoundingClientRect().width + gap);
        }

        // --- logica de botones y navegacion ---
        const prev = car.querySelector('.carousel-btn.prev');
        const next = car.querySelector('.carousel-btn.next');

        // asigna el evento click al boton 'prev'
        if (prev) {
            prev.addEventListener('click', () => {
                grid.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
            });
        }

        // asigna el evento click al boton 'next'
        if (next) {
            next.addEventListener('click', () => {
                grid.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
            });
        }

        // --- control de teclado (accesibilidad) ---
        // permite la activacion de los botones con Enter o Espacio
        [prev, next].forEach(btn => {
            if (!btn) return;

            btn.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault(); // evita la accion por defecto del navegador para Espacio
                    btn.click();
                }
            });
        });
    });

})();

// -----------------------------------------------------------------------------
/**
 * prevencion de desplazamiento nativo
 *
 * previene el desplazamiento por rueda de raton (wheel) o tactil (touchmove)
 * en la cuadricula del carrusel, asegurando que solo los botones lo controlen.
 */
(function() {
    const grids = document.querySelectorAll('.carousel > .game-grid');

    grids.forEach(g => {
        // previene el desplazamiento con rueda del raton
        g.addEventListener('wheel', e => {
            //e.preventDefault();
        }, { passive: false }); // `passive: false` es necesario para que `preventDefault` funcione

        // previene el desplazamiento tactil
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

// cierra el menu al hacer clic fuera del sidebar
document.addEventListener('click', (e) => {
  const isSidebar = sidebar.contains(e.target);
  const isHamburger = hamburgerBtn.contains(e.target);
  if (!isSidebar && !isHamburger && sidebar.classList.contains('active')) {
    sidebar.classList.remove('active');
  }
    const profileBtn = document.querySelector('.icon-btn.perfil');
    const profileMenu = document.querySelector('.menu-perfil');
    const profileMenuBlur = document.querySelector('.menu-perfil-backdrop');
    if(profileMenuBlur.contains(e.target)){
        profileMenu.classList.toggle('oculto');
        profileMenuBlur.classList.toggle('oculto');
    }else if(!profileMenu.contains(e.target) && profileBtn !== e.target){
        profileMenu.classList.add('oculto');
        profileMenuBlur.classList.add('oculto');
    }
});

// obtener todos los botones de favoritos en las cards
const favButtons = document.querySelectorAll('.boton-fav');

// recorrer todos los botones encontrados
favButtons.forEach(button => {
    // añadir un "escuchador" de eventos 'click' a cada boton
    button.addEventListener('click', function() {
        
        // el metodo .toggle() añade la clase 'activo' si no esta,
        // o la quita si ya esta, logrando el efecto de encendido/apagado.
        this.classList.toggle('activo'); 
    });
});

document.addEventListener('DOMContentLoaded', () => {
    /* menu de perfil */
    const profileBtn = document.querySelector('.icon-btn.perfil');
    const profileMenu = document.querySelector('.menu-perfil');
    const profileMenuBlur = document.querySelector('.menu-perfil-backdrop');
    
    profileBtn.addEventListener('click', () => {
        profileMenu.classList.toggle('oculto');
        profileMenuBlur.classList.toggle('oculto');
    });
});

function cerrarSesion(event) {
      event.preventDefault();
      window.location.href = 'index.html';
}




// ...existing code...

const searchInput = document.querySelector('.search-input');
const searchResultsContainer = document.createElement('div');
searchResultsContainer.id = 'search-results-container';
searchResultsContainer.classList.add('buscarJuego');
document.querySelector('.header-center').appendChild(searchResultsContainer);

async function buscarJuegos(query) {
  const apiUrl = `https://vj.interfaces.jima.com.ar/api/v2`;

  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const filtrados = data.filter(game =>
        game.name.toLowerCase().includes(query.toLowerCase())
    );
    return filtrados;
  } catch (error) {
    console.error('Error fetching games:', error);
    return [];
  }
}

function mostrarResultados(resultados) {
  searchResultsContainer.innerHTML = ''; // Limpia los resultados anteriores

  /* if (resultados.length === 0) {
    const noResultsMessage = document.createElement('p');
    noResultsMessage.textContent = 'No se encontraron resultados.';
    searchResultsContainer.appendChild(noResultsMessage);
    return;
  } */

    resultados.forEach(juego => {
    // Crear el contenedor principal del juego
    const gameCard = document.createElement('article');
    gameCard.classList.add('game-card');

    // Imagen
    const imagen = document.createElement('img');
    imagen.src = juego.background_image_low_res;
    imagen.alt = juego.name;
    imagen.classList.add('game-image');
    gameCard.appendChild(imagen);

    // Contenedor de información
    const gameInfo = document.createElement('div');
    gameInfo.classList.add('game-info');

    // Header: título + precio
    const gameHeader = document.createElement('div');
    gameHeader.classList.add('game-header');

    const titulo = document.createElement('h3');
    titulo.classList.add('game-title');
    titulo.textContent = juego.name;
    gameHeader.appendChild(titulo);

    // Precio (ejemplo: si tiene price = 0 mostramos “GRATIS”)
    const price = document.createElement('span');
    price.classList.add('game-price');
    if (juego.price === 0 || !juego.price) {
        price.textContent = 'GRATIS';
        price.classList.add('free-label');
    } else {
        price.textContent = `$${juego.price}`;
    }
    gameHeader.appendChild(price);

    gameInfo.appendChild(gameHeader);

    // Descripción (si la API la provee)
    const descripcion = document.createElement('p');
    descripcion.classList.add('game-desc');
    descripcion.textContent = juego.description_raw 
        ? juego.description_raw.substring(0, 200) + '...' 
        : 'Descripción no disponible.';
    gameInfo.appendChild(descripcion);

    // Footer: rating + botones
    const gameFooter = document.createElement('div');
    gameFooter.classList.add('game-footer');

    // Rating
    const gameRating = document.createElement('div');
    gameRating.classList.add('game-rating');

    const star = document.createElement('span');
    star.classList.add('star');
    star.textContent = '★';

    const ratingValue = document.createElement('span');
    ratingValue.textContent = juego.rating || 'N/A';

    gameRating.appendChild(star);
    gameRating.appendChild(ratingValue);

    // Acciones (favorito + jugar)
    const gameActions = document.createElement('div');
    gameActions.classList.add('game-actions');

    const botonFavorito = document.createElement('div');
    botonFavorito.classList.add('boton-favorito');
    const botonFav = document.createElement('button');
    botonFav.classList.add('boton-fav');
    botonFav.type = 'button';
    botonFavorito.appendChild(botonFav);
    gameActions.appendChild(botonFavorito);

    const linkJugar = document.createElement('a');
    linkJugar.href = 'game.html';

    const btnPlay = document.createElement('button');
    btnPlay.classList.add('btn-play');
    btnPlay.innerHTML = '<span class="play-icon">▶</span>Jugar';

    linkJugar.appendChild(btnPlay);
    gameActions.appendChild(linkJugar);

    // Agregar rating y acciones al footer
    gameFooter.appendChild(gameRating);
    gameFooter.appendChild(gameActions);

    // Agregar footer al bloque de información
    gameInfo.appendChild(gameFooter);

    // Agregar todo al artículo principal
    gameCard.appendChild(gameInfo);

    // Finalmente, agregar la card al contenedor principal
    searchResultsContainer.appendChild(gameCard);
    });

}

function debounce(func, delay) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

const handleSearch = debounce(async (event) => {
  const query = event.target.value.trim();

  if (query.length > 2) {
    const resultados = await buscarJuegos(query);
    mostrarResultados(resultados);
  } else {
    mostrarResultados([]);
  }
}, 300);

searchInput.addEventListener('input', handleSearch);

// Limpia los resultados cuando se borra el input
searchInput.addEventListener('search', () => {
  mostrarResultados([]);
});

// ...existing code...

