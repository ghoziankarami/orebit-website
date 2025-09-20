// Orebit.id Custom JavaScript - Performance & UX Enhancements
// ========================================================

document.addEventListener('DOMContentLoaded', function() {
    
    // 1. NAVBAR SCROLL EFFECTS
    // ========================
    const navbar = document.querySelector('.navbar');
    let lastScrollTop = 0;
    
    function handleNavbarScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add scrolled class for blur effect
        if (scrollTop > 50) {
            navbar?.classList.add('scrolled');
        } else {
            navbar?.classList.remove('scrolled');
        }
        
        // Hide navbar on scroll down, show on scroll up
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            navbar?.style.setProperty('transform', 'translateY(-100%)');
        } else {
            navbar?.style.setProperty('transform', 'translateY(0)');
        }
        
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    }
    
    // Throttle scroll events for better performance
    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(handleNavbarScroll);
            ticking = true;
            setTimeout(() => { ticking = false; }, 16); // ~60fps
        }
    });
    
    // 2. SMOOTH SCROLL WITH OFFSET
    // ============================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const navbarHeight = navbar?.offsetHeight || 80;
                const targetPosition = target.offsetTop - navbarHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // 3. ENHANCED CARD ANIMATIONS
    // ===========================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('fade-in-up');
                }, index * 100); // Stagger animation
                cardObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe cards and feature elements
    document.querySelectorAll('.feature-card, .topic-card, .post-card').forEach(card => {
        cardObserver.observe(card);
    });
    
    // 4. INTERACTIVE SEARCH (if search is implemented)
    // ================================================
    const searchInput = document.querySelector('#search-input');
    if (searchInput) {
        let searchTimeout;
        
        searchInput.addEventListener('input', function(e) {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                performSearch(e.target.value);
            }, 300); // Debounce search
        });
    }
    
    function performSearch(query) {
        // Placeholder for search functionality
        console.log('Searching for:', query);
        // This would integrate with your search implementation
    }
    
    // 5. LAZY LOADING IMAGES
    // ======================
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
    
    // 6. COPY CODE BUTTON ENHANCEMENT
    // ===============================
    document.querySelectorAll('pre code').forEach((block) => {
        // Create copy button
        const copyBtn = document.createElement('button');
        copyBtn.className = 'copy-btn';
        copyBtn.innerHTML = '<i class="fas fa-copy"></i>';
        copyBtn.title = 'Copy to clipboard';
        
        // Insert button
        const pre = block.parentElement;
        pre.style.position = 'relative';
        pre.appendChild(copyBtn);
        
        // Copy functionality
        copyBtn.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(block.textContent);
                copyBtn.innerHTML = '<i class="fas fa-check"></i>';
                copyBtn.classList.add('copied');
                
                setTimeout(() => {
                    copyBtn.innerHTML = '<i class="fas fa-copy"></i>';
                    copyBtn.classList.remove('copied');
                }, 2000);
            } catch (err) {
                console.error('Failed to copy text: ', err);
            }
        });
    });
    
    // 7. ENHANCED MOBILE MENU
    // =======================
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    if (navbarToggler && navbarCollapse) {
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navbarToggler.contains(e.target) && !navbarCollapse.contains(e.target)) {
                if (navbarCollapse.classList.contains('show')) {
                    navbarToggler.click();
                }
            }
        });
        
        // Close menu when clicking on nav links (mobile)
        document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth < 992 && navbarCollapse.classList.contains('show')) {
                    navbarToggler.click();
                }
            });
        });
    }
    
    // 8. PERFORMANCE MONITORING
    // =========================
    function logPerformance() {
        if ('performance' in window) {
            window.addEventListener('load', () => {
                setTimeout(() => {
                    const perfData = performance.getEntriesByType('navigation')[0];
                    if (perfData) {
                        console.group('Performance Metrics');
                        console.log(`Page Load Time: ${Math.round(perfData.loadEventEnd - perfData.fetchStart)}ms`);
                        console.log(`DOM Content Loaded: ${Math.round(perfData.domContentLoadedEventEnd - perfData.fetchStart)}ms`);
                        console.log(`First Paint: ${Math.round(performance.getEntriesByType('paint')[0]?.startTime || 0)}ms`);
                        console.groupEnd();
                    }
                }, 0);
            });
        }
    }
    
    // Only log in development
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        logPerformance();
    }
    
    // 9. ACCESSIBILITY ENHANCEMENTS
    // =============================
    
    // Skip to content functionality
    const skipLink = document.querySelector('.skip-to-content');
    const mainContent = document.querySelector('main, .content, #main-content');
    
    if (skipLink && mainContent) {
        skipLink.addEventListener('click', (e) => {
            e.preventDefault();
            mainContent.focus();
            mainContent.scrollIntoView();
        });
    }
    
    // Enhanced keyboard navigation
    document.addEventListener('keydown', (e) => {
        // ESC to close mobile menu
        if (e.key === 'Escape' && navbarCollapse?.classList.contains('show')) {
            navbarToggler?.click();
        }
    });
    
    // 10. THEME UTILITIES (for future dark mode)
    // ==========================================
    const themeUtils = {
        getSystemTheme: () => {
            return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        },
        
        applyTheme: (theme) => {
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);
        },
        
        toggleTheme: () => {
            const current = document.documentElement.getAttribute('data-theme') || 'light';
            const newTheme = current === 'light' ? 'dark' : 'light';
            themeUtils.applyTheme(newTheme);
            return newTheme;
        }
    };
    
    // Initialize theme (future use)
    // const savedTheme = localStorage.getItem('theme') || themeUtils.getSystemTheme();
    // themeUtils.applyTheme(savedTheme);
    
    // Make theme utils available globally for future use
    window.orebitTheme = themeUtils;
    
    // 11. ANALYTICS HELPERS (Google Analytics 4)
    // ==========================================
    function trackEvent(eventName, parameters = {}) {
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, {
                event_category: 'engagement',
                event_label: window.location.pathname,
                ...parameters
            });
        }
    }
    
    // Track external link clicks
    document.querySelectorAll('a[href^="http"]').forEach(link => {
        link.addEventListener('click', () => {
            trackEvent('external_link_click', {
                link_url: link.href,
                link_text: link.textContent.trim()
            });
        });
    });
    
    // Track button clicks
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', () => {
            trackEvent('button_click', {
                button_text: button.textContent.trim(),
                button_class: button.className
            });
        });
    });
    
    // 12. ERROR HANDLING & FALLBACKS
    // ==============================
    window.addEventListener('error', (e) => {
        console.error('JavaScript Error:', e.error);
        // Could send to error reporting service in production
    });
    
    // Service Worker registration (for future PWA features)
    if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then((registration) => {
                    console.log('SW registered: ', registration);
                })
                .catch((registrationError) => {
                    console.log('SW registration failed: ', registrationError);
                });
        });
    }
    
    console.log('🎯 Orebit.id custom scripts loaded successfully!');
});

// 13. UTILITY FUNCTIONS
// =====================
const orebitUtils = {
    // Debounce function
    debounce: (func, wait, immediate) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                if (!immediate) func(...args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func(...args);
        };
    },
    
    // Throttle function  
    throttle: (func, limit) => {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },
    
    // Format number with commas
    formatNumber: (num) => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    
    // Get reading time estimate
    getReadingTime: (text) => {
        const wordsPerMinute = 200;
        const wordCount = text.trim().split(/\s+/).length;
        const readingTime = Math.ceil(wordCount / wordsPerMinute);
        return `${readingTime} min read`;
    },
    
    // Smooth scroll to element
    scrollToElement: (elementId, offset = 80) => {
        const element = document.getElementById(elementId);
        if (element) {
            const targetPosition = element.offsetTop - offset;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    },
    
    // Check if element is in viewport
    isInViewport: (element) => {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
};

// Make utilities available globally
window.orebitUtils = orebitUtils;

// 14. CSS-IN-JS STYLES FOR DYNAMIC COMPONENTS
// ===========================================
const dynamicStyles = `
/* Copy button styles */
.copy-btn {
    position: absolute;
    top: 0.75rem;
    right: 0.75rem;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: white;
    padding: 0.5rem;
    border-radius: 0.375rem;
    cursor: pointer;
    font-size: 0.875rem;
    transition: all 0.2s ease;
    z-index: 10;
}

.copy-btn:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.05);
}

.copy-btn.copied {
    background: rgba(34, 197, 94, 0.8);
    border-color: rgba(34, 197, 94, 1);
}

/* Lazy loading image styles */
img.lazy {
    opacity: 0;
    transition: opacity 0.3s ease;
}

img.lazy.loaded {
    opacity: 1;
}

/* Loading spinner */
.loading-spinner {
    display: inline-block;
    width: 20px;
    height: 20px;
    border: 2px solid #f3f3f3;
    border-top: 2px solid #1E6CB8;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

/* Enhanced focus indicators */
.focus-visible {
    outline: 2px solid #1E6CB8;
    outline-offset: 2px;
    border-radius: 0.375rem;
}

/* Responsive video wrapper */
.video-wrapper {
    position: relative;
    padding-bottom: 56.25%; /* 16:9 aspect ratio */
    height: 0;
    overflow: hidden;
    max-width: 100%;
    background: #000;
    border-radius: 0.75rem;
}

.video-wrapper iframe,
.video-wrapper video {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: 0;
}

/* Print optimizations */
@media print {
    .copy-btn,
    .navbar,
    .page-footer,
    button {
        display: none !important;
    }
    
    body {
        font-size: 12pt;
        line-height: 1.4;
        color: black !important;
        background: white !important;
    }
    
    a {
        text-decoration: underline;
        color: black !important;
    }
    
    h1, h2, h3, h4, h5, h6 {
        break-after: avoid;
        break-inside: avoid;
    }
    
    pre, blockquote {
        break-inside: avoid;
        border: 1px solid #ccc;
        page-break-inside: avoid;
    }
}

/* High contrast mode */
@media (prefers-contrast: high) {
    .feature-card,
    .topic-card,
    .post-card {
        border: 2px solid #000 !important;
    }
    
    .btn {
        border: 2px solid currentColor !important;
    }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
    }
}

/* Dark mode preparation */
@media (prefers-color-scheme: dark) {
    :root {
        --bg-primary: #1a1a1a;
        --bg-secondary: #2d2d2d;
        --text-primary: #ffffff;
        --text-secondary: #b3b3b3;
    }
    
    /* These will be used when dark mode is implemented */
}

/* Mobile-first responsive utilities */
@media (max-width: 576px) {
    .copy-btn {
        top: 0.5rem;
        right: 0.5rem;
        padding: 0.375rem;
        font-size: 0.8rem;
    }
}

/* Tablet optimizations */
@media (min-width: 768px) and (max-width: 1024px) {
    .feature-card,
    .topic-card {
        padding: 1.25rem;
    }
}

/* Large screen optimizations */
@media (min-width: 1400px) {
    .main-container {
        max-width: 1320px;
    }
}
`;

// Inject dynamic styles
const styleSheet = document.createElement('style');
styleSheet.textContent = dynamicStyles;
document.head.appendChild(styleSheet);