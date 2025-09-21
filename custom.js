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
    
    // 7. ENHANCED MOBILE MENU - Fixed Visibility Issues
    // =================================================
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    if (navbarToggler && navbarCollapse) {
        // Enhanced hamburger menu functionality
        navbarToggler.addEventListener('click', function() {
            // Add active class for styling
            this.classList.toggle('active');
            
            // Ensure proper ARIA attributes
            const expanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !expanded);
        });
        
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
        
        // Enhanced search functionality
        const searchToggle = document.querySelector('#search-toggle');
        if (searchToggle) {
            searchToggle.addEventListener('click', function(e) {
                e.preventDefault();
                // Toggle search modal or dropdown
                toggleSearchModal();
            });
        }
    }
    
    // Search modal functionality
    function toggleSearchModal() {
        // Create search modal if it doesn't exist
        let searchModal = document.querySelector('#search-modal');
        
        if (!searchModal) {
            searchModal = document.createElement('div');
            searchModal.id = 'search-modal';
            searchModal.innerHTML = `
                <div class="search-modal-overlay">
                    <div class="search-modal-content">
                        <div class="search-modal-header">
                            <h3>Search Orebit.id</h3>
                            <button class="search-modal-close" aria-label="Close search">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                        <div class="search-modal-body">
                            <input type="text" class="search-input" placeholder="Search posts, topics, or content..." autocomplete="off">
                            <div class="search-results"></div>
                        </div>
                        <div class="search-modal-footer">
                            <small>Press ESC to close</small>
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(searchModal);
            
            // Add event listeners for search modal
            const closeBtn = searchModal.querySelector('.search-modal-close');
            const overlay = searchModal.querySelector('.search-modal-overlay');
            const searchInput = searchModal.querySelector('.search-input');
            
            closeBtn.addEventListener('click', () => hideSearchModal());
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) hideSearchModal();
            });
            
            // Search input functionality
            searchInput.addEventListener('input', debounce(function(e) {
                performAdvancedSearch(e.target.value);
            }, 300));
        }
        
        // Show modal
        searchModal.style.display = 'block';
        searchModal.classList.add('show');
        searchModal.querySelector('.search-input').focus();
    }
    
    function hideSearchModal() {
        const searchModal = document.querySelector('#search-modal');
        if (searchModal) {
            searchModal.classList.remove('show');
            setTimeout(() => {
                searchModal.style.display = 'none';
            }, 300);
        }
    }
    
    function performAdvancedSearch(query) {
        const searchResults = document.querySelector('.search-results');
        if (!searchResults) return;
        
        if (query.length < 2) {
            searchResults.innerHTML = '';
            return;
        }
        
        // Show loading
        searchResults.innerHTML = '<div class="search-loading"><div class="loading-spinner"></div> Searching...</div>';
        
        // Simulate search (replace with actual search implementation)
        setTimeout(() => {
            const mockResults = [
                { title: 'Introduction to Geostatistics in R', url: '/posts/geostatistics-intro', type: 'Blog Post' },
                { title: 'GeoDataViz User Guide', url: '/portfolio#geodataviz', type: 'Project' },
                { title: 'About Ghozian Islam Karami', url: '/about', type: 'Page' }
            ].filter(item => 
                item.title.toLowerCase().includes(query.toLowerCase())
            );
            
            if (mockResults.length > 0) {
                searchResults.innerHTML = mockResults.map(result => `
                    <div class="search-result-item">
                        <h4><a href="${result.url}">${result.title}</a></h4>
                        <span class="search-result-type">${result.type}</span>
                    </div>
                `).join('');
            } else {
                searchResults.innerHTML = '<div class="search-no-results">No results found for "' + query + '"</div>';
            }
        }, 500);
    }
    
    // Debounce function for search
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
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
/* Enhanced Mobile Navbar & Search Styles */
.navbar-toggler {
    background: rgba(30, 108, 184, 0.1) !important;
    border: 2px solid #1E6CB8 !important;
    border-radius: 8px !important;
    padding: 10px !important;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
    position: relative !important;
    width: 44px !important;
    height: 44px !important;
}

.navbar-toggler:hover {
    background: rgba(30, 108, 184, 0.2) !important;
    border-color: #1548a0 !important;
    transform: scale(1.05) !important;
}

.navbar-toggler:focus {
    box-shadow: 0 0 0 3px rgba(30, 108, 184, 0.25) !important;
    outline: none !important;
}

.navbar-toggler:active,
.navbar-toggler.active {
    background: rgba(30, 108, 184, 0.3) !important;
    transform: scale(0.95) !important;
}

/* Custom Hamburger Animation */
.navbar-toggler-icon {
    background: none !important;
    position: relative !important;
    width: 24px !important;
    height: 24px !important;
    display: block !important;
}

.navbar-toggler-icon::before,
.navbar-toggler-icon::after {
    content: '' !important;
    position: absolute !important;
    width: 24px !important;
    height: 3px !important;
    background: #1E6CB8 !important;
    border-radius: 2px !important;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
    left: 0 !important;
}

.navbar-toggler-icon::before {
    top: -8px !important;
}

.navbar-toggler-icon::after {
    bottom: -8px !important;
}

.navbar-toggler-icon {
    background: #1E6CB8 !important;
    height: 3px !important;
    border-radius: 2px !important;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

/* Animated state when menu is open */
.navbar-toggler[aria-expanded="true"] .navbar-toggler-icon {
    background: transparent !important;
}

.navbar-toggler[aria-expanded="true"] .navbar-toggler-icon::before {
    transform: rotate(45deg) !important;
    top: 0 !important;
}

.navbar-toggler[aria-expanded="true"] .navbar-toggler-icon::after {
    transform: rotate(-45deg) !important;
    bottom: 0 !important;
}

/* Enhanced Search Icon */
.navbar-nav .nav-link#search-toggle {
    background: rgba(30, 108, 184, 0.1) !important;
    border-radius: 8px !important;
    padding: 10px !important;
    margin: 0 0.25rem !important;
    transition: all 0.3s ease !important;
    width: 44px !important;
    height: 44px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
}

.navbar-nav .nav-link#search-toggle:hover {
    background: rgba(30, 108, 184, 0.2) !important;
    transform: scale(1.05) !important;
}

.navbar-nav .nav-link#search-toggle > .bi {
    color: #1E6CB8 !important;
    font-size: 1.3rem !important;
    font-weight: 600 !important;
}

/* Search Modal Styles */
#search-modal {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 9999;
    opacity: 0;
    transition: all 0.3s ease;
}

#search-modal.show {
    opacity: 1;
}

.search-modal-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(5px);
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding: 2rem;
    padding-top: 5rem;
}

.search-modal-content {
    background: white;
    border-radius: 12px;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    width: 100%;
    max-width: 600px;
    max-height: 80vh;
    overflow: hidden;
    animation: modalSlideIn 0.3s ease-out;
}

.search-modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem;
    border-bottom: 1px solid #E5E7EB;
    background: linear-gradient(135deg, #1E6CB8, #4A9EE7);
    color: white;
}

.search-modal-header h3 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
}

.search-modal-close {
    background: none;
    border: none;
    color: white;
    font-size: 1.5rem;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 6px;
    transition: all 0.2s ease;
}

.search-modal-close:hover {
    background: rgba(255, 255, 255, 0.1);
}

.search-modal-body {
    padding: 1.5rem;
    max-height: 60vh;
    overflow-y: auto;
}

.search-input {
    width: 100%;
    padding: 1rem;
    border: 2px solid #E5E7EB;
    border-radius: 8px;
    font-size: 1.1rem;
    outline: none;
    transition: all 0.3s ease;
    margin-bottom: 1rem;
}

.search-input:focus {
    border-color: #1E6CB8;
    box-shadow: 0 0 0 3px rgba(30, 108, 184, 0.1);
}

.search-results {
    min-height: 100px;
}

.search-result-item {
    padding: 1rem;
    border: 1px solid #E5E7EB;
    border-radius: 8px;
    margin-bottom: 0.5rem;
    transition: all 0.2s ease;
}

.search-result-item:hover {
    background: #F8FAFC;
    border-color: #1E6CB8;
}

.search-result-item h4 {
    margin: 0 0 0.5rem 0;
    font-size: 1.1rem;
}

.search-result-item a {
    color: #1E6CB8;
    text-decoration: none;
}

.search-result-item a:hover {
    text-decoration: underline;
}

.search-result-type {
    display: inline-block;
    background: #E5E7EB;
    color: #6B7280;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 0.8rem;
    font-weight: 500;
}

.search-loading,
.search-no-results {
    text-align: center;
    padding: 2rem;
    color: #6B7280;
}

.search-modal-footer {
    padding: 1rem 1.5rem;
    border-top: 1px solid #E5E7EB;
    background: #F8FAFC;
    text-align: center;
}

.search-modal-footer small {
    color: #6B7280;
}

@keyframes modalSlideIn {
    from {
        opacity: 0;
        transform: translateY(-20px) scale(0.95);
    }
    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

/* Mobile optimizations for search */
@media (max-width: 768px) {
    .search-modal-overlay {
        padding: 1rem;
        padding-top: 2rem;
    }
    
    .search-modal-content {
        max-height: 90vh;
    }
    
    .search-modal-header,
    .search-modal-body {
        padding: 1rem;
    }
    
    .search-input {
        font-size: 1rem;
        padding: 0.875rem;
    }
}

/* Force visibility on all screen sizes */
@media (max-width: 991px) {
    .navbar-toggler {
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
    }
    
    .navbar-nav .nav-link#search-toggle {
        display: flex !important;
        visibility: visible !important;
        opacity: 1 !important;
    }
}
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