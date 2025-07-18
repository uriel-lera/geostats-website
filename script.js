// DOM Elements
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const contactForm = document.querySelector('.contact-form');
const newsletterForm = document.querySelector('.newsletter-form');
const navbar = document.querySelector('.navbar');

// Gallery Carousel Elements
const carouselTrack = document.querySelector('.carousel-track');
const carouselSlides = document.querySelectorAll('.carousel-slide');
const indicators = document.querySelectorAll('.indicator');

// Carousel State
let currentSlide = 0;
let carouselInterval;

// Mobile Navigation Toggle
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Navbar Scroll Effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(15, 23, 42, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(15, 23, 42, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Smooth Scrolling for Navigation Links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Hero Buttons Smooth Scrolling
const heroButtons = document.querySelectorAll('.hero-buttons a');
heroButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = button.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Gallery Carousel Functions
function updateCarousel() {
    if (!carouselTrack) return;
    
    const slideWidth = carouselSlides[0].offsetWidth;
    carouselTrack.style.transform = `translateX(-${currentSlide * slideWidth}px)`;
    
    // Update indicators
    indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentSlide);
    });
}

function nextSlide() {
    if (!carouselSlides.length) return;
    
    currentSlide = (currentSlide + 1) % carouselSlides.length;
    updateCarousel();
}

function goToSlide(slideIndex) {
    if (!carouselSlides.length) return;
    
    currentSlide = slideIndex;
    updateCarousel();
}

// Auto-advance carousel every 3 seconds
function startCarousel() {
    if (!carouselSlides.length) return;
    
    carouselInterval = setInterval(nextSlide, 3000);
}

function stopCarousel() {
    if (carouselInterval) {
        clearInterval(carouselInterval);
    }
}

// Pause carousel on hover
if (carouselTrack) {
    const carouselContainer = document.querySelector('.gallery-carousel');
    
    carouselContainer.addEventListener('mouseenter', stopCarousel);
    carouselContainer.addEventListener('mouseleave', startCarousel);
    
    // Indicator click events
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            goToSlide(index);
            stopCarousel();
            setTimeout(startCarousel, 5000); // Restart auto-advance after 5 seconds
        });
    });
}

// Contact Form Handling
contactForm.addEventListener('submit', (e) => {
    // Get form data
    const formData = new FormData(contactForm);
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');
    
    // Basic validation - si falla, prevenir envío
    if (!name || !email || !message) {
        e.preventDefault();
        showNotification('Por favor, completa todos los campos obligatorios.', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        e.preventDefault();
        showNotification('Por favor, ingresa un email válido.', 'error');
        return;
    }
    
    // Si llegamos aquí, la validación pasó y permitimos que Formspree maneje el envío
    // Mostrar mensaje de envío en progreso
    showNotification('Enviando mensaje...', 'info');
});

// Email validation function
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Enhanced Notification system
function showNotification(message, type) {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    // Choose icon and color based on type
    let icon, bgColor;
    if (type === 'success') {
        icon = 'fa-check-circle';
        bgColor = 'var(--emerald)';
    } else if (type === 'info') {
        icon = 'fa-info-circle';
        bgColor = 'var(--primary-color)';
    } else {
        icon = 'fa-exclamation-circle';
        bgColor = 'var(--rose)';
    }
    
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${icon}"></i>
            <span>${message}</span>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${bgColor};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.75rem;
        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        max-width: 400px;
        backdrop-filter: blur(10px);
    `;
    
    // Add to document
    document.body.appendChild(notification);
    
    // Close button functionality
    const closeButton = notification.querySelector('.notification-close');
    closeButton.addEventListener('click', () => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Enhanced notification animations
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        padding: 0.25rem;
        margin-left: auto;
        opacity: 0.8;
        transition: opacity 0.2s;
        border-radius: 50%;
    }
    
    .notification-close:hover {
        opacity: 1;
        background: rgba(255, 255, 255, 0.1);
    }
`;
document.head.appendChild(notificationStyles);

// Enhanced Scroll Animation Observer
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
        }
    });
}, observerOptions);

// Observe elements for scroll animations
const animateElements = document.querySelectorAll(
    '.project-card, .stat-item, .value-item, .service-main, .contact-info, .slide-content'
);

animateElements.forEach(el => {
    el.classList.add('loading');
    observer.observe(el);
});

// Enhanced scroll animation for new sections
const newAnimateElements = document.querySelectorAll(
    '.timeline-item, .collaboration-card, .mission-section, .vision-section, .social-icon'
);

newAnimateElements.forEach(el => {
    el.classList.add('loading');
    observer.observe(el);
});

// Active navigation link highlighting
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// Update active nav link on scroll
window.addEventListener('scroll', updateActiveNavLink);

// Initialize animations on page load
document.addEventListener('DOMContentLoaded', () => {
    // Add loaded class to trigger animations
    setTimeout(() => {
        document.querySelectorAll('.loading').forEach(el => {
            el.classList.add('loaded');
        });
    }, 100);
    
    // Initialize active nav link
    updateActiveNavLink();
    
    // Start carousel
    startCarousel();
});

// Enhanced map animation
function enhanceMapAnimation() {
    const mapPoints = document.querySelectorAll('.map-point');
    
    mapPoints.forEach((point, index) => {
        // Add staggered animation delay
        point.style.animationDelay = `${index * 0.5}s`;
        
        // Add click interaction
        point.addEventListener('click', () => {
            point.style.animation = 'none';
            setTimeout(() => {
                point.style.animation = 'blink 2s ease-in-out infinite';
            }, 10);
        });
    });
}

// Initialize map animations
enhanceMapAnimation();

// Enhanced form input animations
const formInputs = document.querySelectorAll('.form-group input, .form-group textarea, .form-group select');
formInputs.forEach(input => {
    input.addEventListener('focus', () => {
        input.parentElement.classList.add('focused');
    });
    
    input.addEventListener('blur', () => {
        if (!input.value) {
            input.parentElement.classList.remove('focused');
        }
    });
    
    // Add floating label effect
    input.addEventListener('input', () => {
        if (input.value) {
            input.parentElement.classList.add('has-value');
        } else {
            input.parentElement.classList.remove('has-value');
        }
    });
    
    // Handle select change
    if (input.tagName === 'SELECT') {
        input.addEventListener('change', () => {
            if (input.value) {
                input.parentElement.classList.add('has-value');
            } else {
                input.parentElement.classList.remove('has-value');
            }
        });
    }
});

// Enhanced focus styles
const focusStyles = document.createElement('style');
focusStyles.textContent = `
    .form-group.focused label {
        color: var(--purple);
        transform: translateY(-2px);
        transition: all 0.3s ease;
    }
    
    .form-group.has-value label {
        color: var(--emerald);
    }
    
    .nav-link.active {
        color: var(--primary-color);
    }
    
    .nav-link.active::after {
        width: 100%;
    }
    
    /* Enhanced button loading state */
    .btn.loading {
        position: relative;
        color: transparent;
    }
    
    .btn.loading::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 20px;
        height: 20px;
        border: 2px solid transparent;
        border-top: 2px solid currentColor;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
        0% { transform: translate(-50%, -50%) rotate(0deg); }
        100% { transform: translate(-50%, -50%) rotate(360deg); }
    }
`;
document.head.appendChild(focusStyles);

// Enhanced keyboard navigation support
document.addEventListener('keydown', (e) => {
    // Escape key to close mobile menu
    if (e.key === 'Escape') {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
    
    // Enter key on hamburger menu
    if (e.key === 'Enter' && e.target === hamburger) {
        hamburger.click();
    }
    
    // Arrow keys for carousel navigation
    if (carouselSlides.length > 0) {
        if (e.key === 'ArrowLeft') {
            currentSlide = currentSlide === 0 ? carouselSlides.length - 1 : currentSlide - 1;
            updateCarousel();
            stopCarousel();
            setTimeout(startCarousel, 5000);
        } else if (e.key === 'ArrowRight') {
            nextSlide();
            stopCarousel();
            setTimeout(startCarousel, 5000);
        }
    }
});

// Performance optimization: Throttle scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Apply throttling to scroll events
window.addEventListener('scroll', throttle(() => {
    updateActiveNavLink();
}, 100));

// Preload critical resources
function preloadResources() {
    const criticalResources = [
        'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;700&display=swap',
        'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
    ];
    
    criticalResources.forEach(resource => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = resource;
        link.as = 'style';
        document.head.appendChild(link);
    });
}

// Initialize preloading
preloadResources();

// Enhanced loading states for better UX
function addLoadingStates() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            if (this.type === 'submit') {
                this.classList.add('loading');
                this.disabled = true;
                
                // Remove loading state after form processing
                setTimeout(() => {
                    this.classList.remove('loading');
                    this.disabled = false;
                }, 2000);
            }
        });
    });
}

// Initialize loading states
addLoadingStates();

// Enhanced console welcome message
console.log(`
🗺️ GeoStats - Generando diálogos con cartografía social
=====================================================
¡Bienvenido a nuestro sitio web actualizado!

Una comunidad que democratiza el acceso a datos geoespaciales
y promueve la transparencia mediante cartografía social.

✨ Contenido actualizado:
• Historia completa desde 2021
• Misión, visión y valores detallados
• Proyectos reales con información específica
• Colaboraciones actuales (Movimiento Círculo Verde)
• Noticias y actualizaciones recientes
• Galería interactiva de imágenes
• Información de contacto actualizada

📍 Nos reunimos todos los sábados de 3 a 5 pm
   en LABNL - C. Washington 648, Centro, Monterrey, N.L.

🎯 Únete a nuestros equipos:
• Realización de mapas
• Marketing
• Diseño web
• Análisis de datos

Desarrollado con ❤️ para la comunidad neoleonesa
`);

// Error handling for missing elements
function handleMissingElements() {
    const requiredElements = [
        { selector: '.hamburger', name: 'Hamburger menu' },
        { selector: '.nav-menu', name: 'Navigation menu' },
        { selector: '.contact-form', name: 'Contact form' },
        { selector: '.navbar', name: 'Navigation bar' },
        { selector: '.carousel-track', name: 'Gallery carousel' }
    ];
    
    requiredElements.forEach(element => {
        if (!document.querySelector(element.selector)) {
            console.warn(`${element.name} not found. Some functionality may be limited.`);
        }
    });
}

// Initialize error handling
handleMissingElements();

// Image error handling for gallery
function handleImageErrors() {
    const galleryImages = document.querySelectorAll('.slide-content img');
    
    galleryImages.forEach(img => {
        img.addEventListener('error', function() {
            // Si la imagen no carga, mostrar placeholder
            this.style.display = 'none';
            this.parentElement.classList.add('image-error');
            
            // Crear elemento de placeholder
            const placeholder = document.createElement('div');
            placeholder.className = 'image-placeholder';
            placeholder.innerHTML = `
                <div class="placeholder-content">
                    <i class="fas fa-image"></i>
                    <p>Imagen no disponible</p>
                    <small>Agrega tu imagen aquí</small>
                </div>
            `;
            
            this.parentElement.appendChild(placeholder);
        });
        
        img.addEventListener('load', function() {
            // Imagen cargada exitosamente
            this.parentElement.classList.add('image-loaded');
        });
    });
}

// Add placeholder styles
const placeholderStyles = document.createElement('style');
placeholderStyles.textContent = `
    .image-placeholder {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: var(--surface);
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--text-muted);
        text-align: center;
        z-index: 5;
    }
    
    .placeholder-content i {
        font-size: 3rem;
        margin-bottom: 1rem;
        color: var(--text-muted);
    }
    
    .placeholder-content p {
        font-size: 1.2rem;
        margin-bottom: 0.5rem;
        color: var(--text-secondary);
    }
    
    .placeholder-content small {
        color: var(--text-muted);
        font-size: 0.9rem;
    }
    
    .slide-content.image-error::after {
        opacity: 0;
    }
    
    .slide-content.image-loaded {
        background: transparent;
    }
`;
document.head.appendChild(placeholderStyles);

// Initialize image error handling
handleImageErrors();

// Resize handler for responsive carousel
window.addEventListener('resize', throttle(() => {
    if (carouselTrack) {
        updateCarousel();
    }
}, 250));

// Intersection Observer for performance optimization
const performanceObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Trigger animations only when elements are visible
            entry.target.classList.add('animate');
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '50px'
});

// Observe performance-critical elements
document.querySelectorAll('.floating-shape, .particle').forEach(el => {
    performanceObserver.observe(el);
});

// Touch support for mobile carousel
let touchStartX = 0;
let touchEndX = 0;

if (carouselTrack) {
    const carouselContainer = document.querySelector('.gallery-carousel');
    
    carouselContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    carouselContainer.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe left - next slide
                nextSlide();
            } else {
                // Swipe right - previous slide
                currentSlide = currentSlide === 0 ? carouselSlides.length - 1 : currentSlide - 1;
                updateCarousel();
            }
            
            stopCarousel();
            setTimeout(startCarousel, 5000);
        }
    }
} 

// Enhanced form validation messages
function getValidationMessage(field, value) {
    const messages = {
        name: {
            empty: 'Por favor, ingresa tu nombre completo.',
            invalid: 'El nombre debe tener al menos 2 caracteres.'
        },
        email: {
            empty: 'Por favor, ingresa tu dirección de email.',
            invalid: 'Por favor, ingresa un email válido (ejemplo: nombre@dominio.com).'
        },
        message: {
            empty: 'Por favor, escribe tu mensaje.',
            invalid: 'El mensaje debe tener al menos 10 caracteres.'
        }
    };
    
    if (!value || value.trim() === '') {
        return messages[field]?.empty || 'Este campo es obligatorio.';
    }
    
    if (field === 'name' && value.length < 2) {
        return messages[field].invalid;
    }
    
    if (field === 'message' && value.length < 10) {
        return messages[field].invalid;
    }
    
    return null;
}

// Add smooth reveal animation for sections
function addSectionRevealAnimation() {
    const sections = document.querySelectorAll('section');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('section-revealed');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    sections.forEach(section => {
        section.classList.add('section-hidden');
        revealObserver.observe(section);
    });
}

// Add section reveal styles
const sectionRevealStyles = document.createElement('style');
sectionRevealStyles.textContent = `
    .section-hidden {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .section-revealed {
        opacity: 1;
        transform: translateY(0);
    }
    
    .timeline-item {
        transition: transform 0.3s ease, background-color 0.3s ease;
    }
    
    .collaboration-card {
        transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
    }
    
    .social-icon {
        transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
`;
document.head.appendChild(sectionRevealStyles);

// Initialize section reveal animation
addSectionRevealAnimation();

// Timeline animation enhancement
function enhanceTimelineAnimation() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    timelineItems.forEach((item, index) => {
        // Add staggered animation delay
        item.style.animationDelay = `${index * 0.2}s`;
        
        // Add hover interaction
        item.addEventListener('mouseenter', () => {
            item.style.transform = 'translateX(10px) scale(1.02)';
        });
        
        item.addEventListener('mouseleave', () => {
            item.style.transform = 'translateX(0) scale(1)';
        });
    });
}

// Initialize timeline animations
enhanceTimelineAnimation();

// Social icons interaction
function enhanceSocialIcons() {
    const socialIcons = document.querySelectorAll('.social-icon');
    
    socialIcons.forEach((icon, index) => {
        icon.addEventListener('mouseenter', () => {
            icon.style.transform = 'translateY(-5px) scale(1.15) rotate(5deg)';
        });
        
        icon.addEventListener('mouseleave', () => {
            icon.style.transform = 'translateY(0) scale(1) rotate(0deg)';
        });
        
        // Add click animation
        icon.addEventListener('click', (e) => {
            e.preventDefault();
            icon.style.transform = 'scale(0.9)';
            setTimeout(() => {
                icon.style.transform = 'scale(1)';
            }, 150);
        });
    });
}

// Initialize social icons
enhanceSocialIcons();

// Collaboration cards interaction
function enhanceCollaborationCards() {
    const collaborationCards = document.querySelectorAll('.collaboration-card');
    
    collaborationCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            const icon = card.querySelector('.collaboration-icon');
            if (icon) {
                icon.style.transform = 'scale(1.15) rotate(10deg)';
            }
        });
        
        card.addEventListener('mouseleave', () => {
            const icon = card.querySelector('.collaboration-icon');
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0deg)';
            }
        });
    });
}

// Initialize collaboration cards
enhanceCollaborationCards(); 

// Newsletter Form Handling
if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        const email = newsletterForm.querySelector('input[type="email"]').value;
        
        if (!email) {
            e.preventDefault();
            showNotification('Por favor, ingresa tu email.', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            e.preventDefault();
            showNotification('Por favor, ingresa un email válido.', 'error');
            return;
        }
        
        // Si la validación pasa, permitir el envío
        showNotification('Suscribiendo...', 'info');
    });
}

// Check URL parameters for success messages
window.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    
    if (urlParams.get('enviado') === 'true') {
        showNotification('¡Mensaje enviado exitosamente! Te contactaremos pronto.', 'success');
        // Limpiar URL
        window.history.replaceState({}, document.title, window.location.pathname);
    }
    
    if (urlParams.get('suscrito') === 'true') {
        showNotification('¡Te has suscrito exitosamente! Recibirás nuestras noticias.', 'success');
        // Limpiar URL
        window.history.replaceState({}, document.title, window.location.pathname);
    }
});

// Enhanced news cards interaction
function enhanceNewsCards() {
    const newsCards = document.querySelectorAll('.news-card');
    
    newsCards.forEach((card, index) => {
        // Add staggered animation delay
        card.style.animationDelay = `${index * 0.2}s`;
        
        // Add click interaction for news cards
        card.addEventListener('click', () => {
            const newsTitle = card.querySelector('h3').textContent;
            const newsCategory = card.querySelector('.news-category').textContent;
            
            // Simulate news article opening
            showNotification(`Abriendo artículo: ${newsTitle} (${newsCategory})`, 'success');
            
            // Add click animation
            card.style.transform = 'scale(0.98)';
            setTimeout(() => {
                card.style.transform = '';
            }, 150);
        });
        
        // Add hover effect for featured news
        if (card.classList.contains('featured')) {
            card.addEventListener('mouseenter', () => {
                card.style.background = 'linear-gradient(135deg, var(--surface) 0%, rgba(37, 99, 235, 0.05) 100%)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.background = 'var(--surface)';
            });
        }
    });
}

// Initialize news cards
enhanceNewsCards();

// Add scroll-triggered animations for new sections
const newSectionElements = document.querySelectorAll(
    '.news-card'
);

newSectionElements.forEach(el => {
    el.classList.add('loading');
    observer.observe(el);
});

// Enhanced keyboard navigation for new sections
document.addEventListener('keydown', (e) => {
    // Tab navigation for news cards
    if (e.key === 'Tab') {
        const newsCards = document.querySelectorAll('.news-card');
        newsCards.forEach(card => {
            card.setAttribute('tabindex', '0');
        });
    }
    
    // Enter key for news cards
    if (e.key === 'Enter' && e.target.classList.contains('news-card')) {
        e.target.click();
    }
});

// Enhanced console welcome message
console.log(`
🗺️ GeoStats - Generando diálogos con cartografía social
=====================================================
¡Bienvenido a nuestro sitio web actualizado!

Una comunidad que democratiza el acceso a datos geoespaciales
y promueve la transparencia mediante cartografía social.

✨ Contenido actualizado:
• Historia completa desde 2021
• Misión, visión y valores detallados
• Proyectos reales con información específica
• Colaboraciones actuales (Movimiento Círculo Verde)
• Noticias y actualizaciones recientes
• Galería interactiva de imágenes
• Información de contacto actualizada

📍 Nos reunimos todos los sábados de 3 a 5 pm
   en LABNL - C. Washington 648, Centro, Monterrey, N.L.

🎯 Únete a nuestros equipos:
• Realización de mapas
• Marketing
• Diseño web
• Análisis de datos

Desarrollado con ❤️ para la comunidad neoleonesa
`);

// Enhanced form validation for newsletter
function validateNewsletterEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const commonDomains = ['gmail.com', 'hotmail.com', 'yahoo.com', 'outlook.com'];
    
    if (!emailRegex.test(email)) {
        return false;
    }
    
    const domain = email.split('@')[1];
    return commonDomains.includes(domain) || domain.includes('.');
}

// Add enhanced loading states for newsletter
function addNewsletterLoadingState() {
    const newsletterButton = document.querySelector('.newsletter-form .btn');
    
    if (newsletterButton) {
        newsletterButton.addEventListener('click', function() {
            this.classList.add('loading');
            this.disabled = true;
            
            setTimeout(() => {
                this.classList.remove('loading');
                this.disabled = false;
            }, 2000);
        });
    }
}

// Initialize newsletter enhancements
addNewsletterLoadingState();

// Add news date animation
function addNewsDateAnimation() {
    const newsDates = document.querySelectorAll('.news-date');
    
    newsDates.forEach(date => {
        date.addEventListener('mouseenter', () => {
            date.style.transform = 'scale(1.05) rotate(2deg)';
        });
        
        date.addEventListener('mouseleave', () => {
            date.style.transform = 'scale(1) rotate(0deg)';
        });
    });
}

// Initialize news date animations
addNewsDateAnimation(); 