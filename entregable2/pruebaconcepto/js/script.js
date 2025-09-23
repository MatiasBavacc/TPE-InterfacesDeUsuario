// Game Page Interactive Functionality

class GamePage {
    constructor() {
        this.currentSlide = 0;
        this.isExpanded = false;
        this.likedComments = new Set();
        this.dislikedComments = new Set();
        
        this.init();
    }

    init() {
        this.setupCarousel();
        this.setupCommentInteractions();
        this.setupReadMore();
        this.setupSearch();
        this.setupMobileMenu();
        this.setupFormSubmission();
        this.addScrollEffects();
    }

    // Carousel functionality
    setupCarousel() {
        const indicators = document.querySelectorAll('.indicator');
        const images = document.querySelectorAll('.carousel-image');

        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                this.goToSlide(index);
            });
        });

        // Auto-play carousel
        setInterval(() => {
            this.nextSlide();
        }, 5000);
    }

    goToSlide(slideIndex) {
        const images = document.querySelectorAll('.carousel-image');
        const indicators = document.querySelectorAll('.indicator');

        // Remove active class from all
        images.forEach(img => img.classList.remove('active'));
        indicators.forEach(ind => ind.classList.remove('active'));

        // Add active class to current
        images[slideIndex].classList.add('active');
        indicators[slideIndex].classList.add('active');

        this.currentSlide = slideIndex;
    }

    nextSlide() {
        const totalSlides = document.querySelectorAll('.carousel-image').length;
        const nextIndex = (this.currentSlide + 1) % totalSlides;
        this.goToSlide(nextIndex);
    }

    // Comment interactions
    setupCommentInteractions() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('.like-btn')) {
                this.handleLikeClick(e.target.closest('.like-btn'));
            }
            
            if (e.target.closest('.dislike-btn')) {
                this.handleDislikeClick(e.target.closest('.dislike-btn'));
            }
        });
    }

    handleLikeClick(button) {
        const commentId = this.getCommentId(button);
        const countSpan = button.querySelector('span');
        let count = parseInt(countSpan.textContent);

        if (this.likedComments.has(commentId)) {
            // Unlike
            this.likedComments.delete(commentId);
            count--;
            button.classList.remove('active');
        } else {
            // Like
            this.likedComments.add(commentId);
            count++;
            button.classList.add('active');
            
            // Remove dislike if it was active
            if (this.dislikedComments.has(commentId)) {
                this.dislikedComments.delete(commentId);
                const dislikeBtn = button.parentElement.querySelector('.dislike-btn');
                const dislikeCount = dislikeBtn.querySelector('span');
                dislikeCount.textContent = Math.max(0, parseInt(dislikeCount.textContent) - 1);
                dislikeBtn.classList.remove('active');
            }
        }

        countSpan.textContent = count;
        this.animateButton(button);
    }

    handleDislikeClick(button) {
        const commentId = this.getCommentId(button);
        const countSpan = button.querySelector('span');
        let count = parseInt(countSpan.textContent);

        if (this.dislikedComments.has(commentId)) {
            // Un-dislike
            this.dislikedComments.delete(commentId);
            count = Math.max(0, count - 1);
            button.classList.remove('active');
        } else {
            // Dislike
            this.dislikedComments.add(commentId);
            count++;
            button.classList.add('active');
            
            // Remove like if it was active
            if (this.likedComments.has(commentId)) {
                this.likedComments.delete(commentId);
                const likeBtn = button.parentElement.querySelector('.like-btn');
                const likeCount = likeBtn.querySelector('span');
                likeCount.textContent = Math.max(0, parseInt(likeCount.textContent) - 1);
                likeBtn.classList.remove('active');
            }
        }

        countSpan.textContent = count;
        this.animateButton(button);
    }

    getCommentId(button) {
        return button.closest('.comment').dataset.commentId || 
               Array.from(document.querySelectorAll('.comment')).indexOf(button.closest('.comment'));
    }

    animateButton(button) {
        button.style.transform = 'scale(1.2)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 150);
    }

    // Read more functionality
    setupReadMore() {
        const readMoreBtn = document.getElementById('readMoreBtn');
        const expandableComment = document.getElementById('expandableComment');

        if (readMoreBtn && expandableComment) {
            readMoreBtn.addEventListener('click', () => {
                const preview = expandableComment.querySelector('.comment-preview');
                const full = expandableComment.querySelector('.comment-full');

                if (!this.isExpanded) {
                    preview.style.display = 'none';
                    full.style.display = 'inline';
                    readMoreBtn.textContent = 'Leer Menos';
                    this.isExpanded = true;
                } else {
                    preview.style.display = 'inline';
                    full.style.display = 'none';
                    readMoreBtn.textContent = 'Leer Mas';
                    this.isExpanded = false;
                }
            });
        }
    }

    // Search functionality
    setupSearch() {
        const searchInput = document.getElementById('searchInput');
        
        if (searchInput) {
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const query = searchInput.value.trim();
                    if (query) {
                        this.performSearch(query);
                    }
                }
            });

            // Add search suggestions
            searchInput.addEventListener('input', (e) => {
                const query = e.target.value.trim();
                if (query.length > 2) {
                    this.showSearchSuggestions(query);
                } else {
                    this.hideSearchSuggestions();
                }
            });
        }
    }

    performSearch(query) {
        console.log(`Searching for: ${query}`);
        // Here you would implement actual search functionality
        this.showNotification(`Buscando: "${query}"`);
    }

    showSearchSuggestions(query) {
        // Mock search suggestions
        const suggestions = [
            'Pac Solitaire',
            'Puzzle Games',
            'Strategy Games',
            'Card Games',
            'Board Games'
        ].filter(item => item.toLowerCase().includes(query.toLowerCase()));

        // You could implement a dropdown here
        console.log('Suggestions:', suggestions);
    }

    hideSearchSuggestions() {
        // Hide suggestions dropdown
    }

    // Mobile menu
    setupMobileMenu() {
        const burgerMenu = document.getElementById('burgerMenu');
        
        if (burgerMenu) {
            burgerMenu.addEventListener('click', () => {
                this.toggleMobileMenu();
            });
        }
    }

    toggleMobileMenu() {
        // Create mobile menu if it doesn't exist
        let mobileMenu = document.getElementById('mobileMenu');
        
        if (!mobileMenu) {
            mobileMenu = this.createMobileMenu();
            document.body.appendChild(mobileMenu);
        }

        mobileMenu.classList.toggle('active');
    }

    createMobileMenu() {
        const menu = document.createElement('div');
        menu.id = 'mobileMenu';
        menu.className = 'mobile-menu';
        menu.innerHTML = `
            <div class="mobile-menu-content">
                <button class="close-menu" onclick="document.getElementById('mobileMenu').classList.remove('active')">&times;</button>
                <nav class="mobile-nav">
                    <a href="#">Home</a>
                    <a href="#">Perfil</a>
                    <a href="#">Menu</a>
                    <a href="#">Categorias</a>
                    <a href="#">Solitario</a>
                </nav>
            </div>
            <div class="mobile-menu-overlay" onclick="document.getElementById('mobileMenu').classList.remove('active')"></div>
        `;

        // Add styles for mobile menu
        const style = document.createElement('style');
        style.textContent = `
            .mobile-menu {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 9999;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
            }
            
            .mobile-menu.active {
                opacity: 1;
                visibility: visible;
            }
            
            .mobile-menu-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.7);
            }
            
            .mobile-menu-content {
                position: absolute;
                top: 0;
                left: 0;
                width: 300px;
                height: 100%;
                background: #3c3076;
                padding: 20px;
                transform: translateX(-100%);
                transition: transform 0.3s ease;
            }
            
            .mobile-menu.active .mobile-menu-content {
                transform: translateX(0);
            }
            
            .close-menu {
                position: absolute;
                top: 20px;
                right: 20px;
                background: none;
                border: none;
                color: white;
                font-size: 30px;
                cursor: pointer;
            }
            
            .mobile-nav {
                margin-top: 60px;
                display: flex;
                flex-direction: column;
                gap: 20px;
            }
            
            .mobile-nav a {
                color: white;
                font-size: 20px;
                text-decoration: none;
                padding: 15px 0;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                transition: color 0.3s;
            }
            
            .mobile-nav a:hover {
                color: #ecc47d;
            }
        `;
        document.head.appendChild(style);

        return menu;
    }

    // Form submission
    setupFormSubmission() {
        const submitBtn = document.querySelector('.submit-btn');
        const emailInput = document.querySelector('.email-input');

        if (submitBtn && emailInput) {
            submitBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleEmailSubmission(emailInput.value);
            });

            emailInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.handleEmailSubmission(emailInput.value);
                }
            });
        }
    }

    handleEmailSubmission(email) {
        if (this.validateEmail(email)) {
            this.showNotification('¡Gracias por suscribirte!');
            document.querySelector('.email-input').value = '';
        } else {
            this.showNotification('Por favor ingresa un email válido');
        }
    }

    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Scroll effects
    addScrollEffects() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                }
            });
        }, observerOptions);

        // Observe elements for animation
        document.querySelectorAll('.comment, .rating-row, .tag').forEach(el => {
            observer.observe(el);
        });
    }

    // Utility function for notifications
    showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: #6c60a3;
            color: white;
            padding: 15px 25px;
            border-radius: 5px;
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            animation: slideInRight 0.3s ease;
        `;

        // Add animation styles
        if (!document.getElementById('notificationStyles')) {
            const style = document.createElement('style');
            style.id = 'notificationStyles';
            style.textContent = `
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOutRight {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(notification);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease forwards';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // Game action handlers
    setupGameActions() {
        document.querySelectorAll('.game-action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = this.getActionType(btn);
                this.handleGameAction(action);
            });
        });
    }

    getActionType(button) {
        if (button.classList.contains('share-btn')) return 'share';
        if (button.classList.contains('star-btn')) return 'rate';
        if (button.classList.contains('favorite-btn')) return 'favorite';
        if (button.classList.contains('fullscreen-btn')) return 'fullscreen';
        return 'unknown';
    }

    handleGameAction(action) {
        switch (action) {
            case 'share':
                this.shareGame();
                break;
            case 'rate':
                this.rateGame();
                break;
            case 'favorite':
                this.toggleFavorite();
                break;
            case 'fullscreen':
                this.toggleFullscreen();
                break;
        }
    }

    shareGame() {
        if (navigator.share) {
            navigator.share({
                title: 'Pac Solitaire',
                text: 'Check out this amazing game!',
                url: window.location.href
            });
        } else {
            // Fallback for browsers without Web Share API
            const url = window.location.href;
            navigator.clipboard.writeText(url).then(() => {
                this.showNotification('¡Link copiado al portapapeles!');
            });
        }
    }

    rateGame() {
        this.showNotification('¡Gracias por tu calificación!');
    }

    toggleFavorite() {
        this.showNotification('Agregado a favoritos');
    }

    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    }
}

// Initialize the game page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const gamePage = new GamePage();
    
    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add loading states
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('load', function() {
            this.classList.add('fade-in');
        });
    });

    // Lazy loading for images
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // Performance optimization
    let ticking = false;
    
    function updateScrollPosition() {
        const scrolled = window.pageYOffset;
        const parallax = document.querySelector('.game-canvas');
        
        if (parallax) {
            const speed = scrolled * 0.5;
            parallax.style.transform = `translateY(${speed}px)`;
        }
        
        ticking = false;
    }

    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateScrollPosition);
            ticking = true;
        }
    }

    window.addEventListener('scroll', requestTick);
});

// Service Worker registration for better performance
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}