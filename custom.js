// Orebit.id Simplified Mobile JavaScript
// =====================================

document.addEventListener('DOMContentLoaded', function() {
    
    // 1. NAVBAR SCROLL EFFECTS
    const navbar = document.querySelector('.navbar');
    let lastScrollTop = 0;
    
    function handleNavbarScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 50) {
            navbar?.classList.add('scrolled');
        } else {
            navbar?.classList.remove('scrolled');
        }
        
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    }
    
    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(handleNavbarScroll);
            ticking = true;
            setTimeout(() => { ticking = false; }, 16);
        }
    });
    
    // 2. SMOOTH SCROLL WITH OFFSET
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
    
    // 3. MOBILE MENU BEHAVIOR - CRITICAL FIX
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    if (navbarToggler && navbarCollapse) {
        
        // FORCE CORRECT INITIAL STATE
        navbarToggler.classList.add('collapsed');
        navbarToggler.setAttribute('aria-expanded', 'false');
        navbarCollapse.classList.remove('show');
        
        // ENHANCED TOGGLE BEHAVIOR
        navbarToggler.addEventListener('click', function(e) {
            e.preventDefault();
            
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            
            if (isExpanded) {
                // Close menu
                this.classList.add('collapsed');
                this.setAttribute('aria-expanded', 'false');
                navbarCollapse.classList.remove('show');
            } else {
                // Open menu  
                this.classList.remove('collapsed');
                this.setAttribute('aria-expanded', 'true');
                navbarCollapse.classList.add('show');
            }
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navbarToggler.contains(e.target) && 
                !navbarCollapse.contains(e.target) && 
                navbarCollapse.classList.contains('show')) {
                navbarToggler.click();
            }
        });
        
        // Close menu when clicking nav links (mobile)
        document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth < 992 && navbarCollapse.classList.contains('show')) {
                    navbarToggler.click();
                }
            });
        });
    }
    
    // 4. SEARCH FUNCTIONALITY - Single Icon Only
    const searchLink = document.querySelector('.navbar-nav a[href="#"]:has(.bi-search)');
    if (searchLink) {
        searchLink.addEventListener('click', function(e) {
            e.preventDefault();
            showSearchModal();
        });
    }
    
    // Search modal functionality
    function showSearchModal() {
        let searchModal = document.querySelector('#search-modal');
        
        if (!searchModal) {
            searchModal = document.createElement('div');
            searchModal.id = 'search-modal';
            searchModal.innerHTML = `
                <div class="search-overlay">
                    <div class="search-container">
                        <div class="search-header">
                            <h3>Search Orebit.id</h3>
                            <button class="search-close">&times;</button>
                        </div>
                        <div class="search-body">
                            <input type="text" class="search-input" 
                                   placeholder="Search posts, topics, or content..." 
                                   autocomplete="off">
                            <div class="search-results"></div>
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(searchModal);
            
            // Search modal event listeners
            const closeBtn = searchModal.querySelector('.search-close');
            const overlay = searchModal.querySelector('.search-overlay');
            const searchInput = searchModal.querySelector('.search-input');
            
            closeBtn.addEventListener('click', hideSearchModal);
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) hideSearchModal();
            });
            
            searchInput.addEventListener('input', debounce(function(e) {
                performSearch(e.target.value);
            }, 300));
        }
        
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
    
    function performSearch(query) {
        const searchResults = document.querySelector('.search-results');
        if (!searchResults || query.length < 2) return;
        
        searchResults.innerHTML = '<div class="search-loading">Searching...</div>';
        
        // Mock search results
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
                searchResults.innerHTML = `<div class="search-no-results">No results found for "${query}"</div>`;
            }
        }, 300);
    }
    
    // 5. ENHANCED CARD ANIMATIONS
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('fade-in-up');
                }, index * 100);
                cardObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.feature-card, .topic-card, .post-card').forEach(card => {
        cardObserver.observe(card);
    });
    
    // 6. UTILITY FUNCTIONS
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
    
    // 7. KEYBOARD SHORTCUTS
    document.addEventListener('keydown', (e) => {
        // ESC to close modals
        if (e.key === 'Escape') {
            hideSearchModal();
            if (navbarCollapse?.classList.contains('show')) {
                navbarToggler?.click();
            }
        }
        
        // Ctrl+K or Cmd+K for search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            showSearchModal();
        }
    });
    
    console.log('🎯 Orebit.id mobile scripts loaded successfully!');
});

// DYNAMIC CSS FOR SEARCH MODAL
const searchStyles = `
#search-modal {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 9999;
    opacity: 0;
    transition: opacity 0.3s ease;
}

#search-modal.show {
    opacity: 1;
}

.search-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding: 2rem;
    padding-top: 5rem;
}

.search-container {
    background: white;
    border-radius: 12px;
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
    width: 100%;
    max-width: 600px;
    max-height: 80vh;
    overflow: hidden;
}

.search-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem;
    border-bottom: 1px solid #E5E7EB;
    background: linear-gradient(135deg, #1E6CB8, #4A9EE7);
    color: white;
}

.search-header h3 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
}

.search-close {
    background: none;
    border: none;
    color: white;
    font-size: 2rem;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 6px;
    line-height: 1;
}

.search-close:hover {
    background: rgba(255, 255, 255, 0.1);
}

.search-body {
    padding: 1.5rem;
    max-height: 60vh;
    overflow-y: auto;
}

.search-input {