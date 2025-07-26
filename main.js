// Main JavaScript for puff.org.tr

document.addEventListener('DOMContentLoaded', function() {
    
    // Tab functionality
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');
            
            // Remove active class from all buttons and panes
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));
            
            // Add active class to clicked button and corresponding pane
            button.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });
    
    // Product image gallery
    const mainImage = document.querySelector('.main-image');
    const thumbnailImages = document.querySelectorAll('.thumbnail-images img');
    
    if (mainImage && thumbnailImages.length > 0) {
        thumbnailImages.forEach(thumb => {
            thumb.addEventListener('click', () => {
                mainImage.src = thumb.src.replace('-1', '-main').replace('-2', '-main').replace('-3', '-main');
                
                // Update active thumbnail
                thumbnailImages.forEach(t => t.classList.remove('active'));
                thumb.classList.add('active');
            });
        });
    }
    
    // Flavor selection
    const flavorOptions = document.querySelectorAll('.flavor-option');
    
    flavorOptions.forEach(option => {
        option.addEventListener('click', () => {
            const radio = option.querySelector('input[type="radio"]');
            radio.checked = true;
            
            // Update active state
            flavorOptions.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
        });
    });
    
    // Add to cart functionality
    const addToCartButtons = document.querySelectorAll('.btn-primary');
    
    addToCartButtons.forEach(button => {
        if (button.textContent.includes('Sepete Ekle')) {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Get product information
                const productName = document.querySelector('h1')?.textContent || 'Ürün';
                const selectedFlavor = document.querySelector('input[name="flavor"]:checked')?.value || 'varsayılan';
                
                // Show success message
                showNotification(`${productName} (${selectedFlavor}) sepete eklendi!`, 'success');
                
                // Track event
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'add_to_cart', {
                        'currency': 'TRY',
                        'value': 89.99,
                        'items': [{
                            'item_id': 'PUFF-PLUS-001',
                            'item_name': productName,
                            'category': 'Elektronik Sigara',
                            'brand': 'Puff',
                            'price': 89.99,
                            'variant': selectedFlavor
                        }]
                    });
                }
            });
        }
    });
    
    // Add to favorites functionality
    const addToFavoritesButtons = document.querySelectorAll('.btn-secondary');
    
    addToFavoritesButtons.forEach(button => {
        if (button.textContent.includes('Favorilere Ekle')) {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                
                const productName = document.querySelector('h1')?.textContent || 'Ürün';
                showNotification(`${productName} favorilere eklendi!`, 'info');
                
                // Track event
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'add_to_wishlist', {
                        'currency': 'TRY',
                        'value': 89.99,
                        'items': [{
                            'item_id': 'PUFF-PLUS-001',
                            'item_name': productName,
                            'category': 'Elektronik Sigara',
                            'brand': 'Puff',
                            'price': 89.99
                        }]
                    });
                }
            });
        }
    });
    
    // Notification system
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
            color: white;
            padding: 1rem;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            z-index: 10000;
            max-width: 300px;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Close button functionality
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.remove();
        });
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }
    
    // Lazy loading for images
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    
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
        
        lazyImages.forEach(img => imageObserver.observe(img));
    }
    
    // Smooth scrolling for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Search functionality
    const searchInput = document.querySelector('.search-input');
    const searchResults = document.querySelector('.search-results');
    
    if (searchInput && searchResults) {
        let searchTimeout;
        
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            
            searchTimeout = setTimeout(() => {
                const query = this.value.trim();
                
                if (query.length >= 2) {
                    performSearch(query);
                } else {
                    searchResults.style.display = 'none';
                }
            }, 300);
        });
        
        // Close search results when clicking outside
        document.addEventListener('click', function(e) {
            if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
                searchResults.style.display = 'none';
            }
        });
    }
    
    function performSearch(query) {
        // Mock search results - replace with actual search API
        const mockResults = [
            { title: 'Puff Plus', url: '/urun/puff-plus', description: '800 puf kapasitesi' },
            { title: 'Puff XL', url: '/urun/puff-xl', description: '1600 puf kapasitesi' },
            { title: 'Vozol Puff', url: '/urun/vozol-puff', description: 'Premium kalite' }
        ].filter(item => 
            item.title.toLowerCase().includes(query.toLowerCase()) ||
            item.description.toLowerCase().includes(query.toLowerCase())
        );
        
        displaySearchResults(mockResults);
    }
    
    function displaySearchResults(results) {
        if (results.length === 0) {
            searchResults.innerHTML = '<div class="no-results">Sonuç bulunamadı</div>';
        } else {
            searchResults.innerHTML = results.map(result => `
                <a href="${result.url}" class="search-result-item">
                    <h4>${result.title}</h4>
                    <p>${result.description}</p>
                </a>
            `).join('');
        }
        
        searchResults.style.display = 'block';
    }
    
    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
        });
    }
    
    // Form validation
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const requiredFields = form.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('error');
                    
                    // Remove error class after user starts typing
                    field.addEventListener('input', function() {
                        this.classList.remove('error');
                    }, { once: true });
                }
            });
            
            if (!isValid) {
                e.preventDefault();
                showNotification('Lütfen tüm gerekli alanları doldurun.', 'error');
            }
        });
    });
    
    // Performance monitoring
    if ('performance' in window) {
        window.addEventListener('load', () => {
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            console.log(`Sayfa yükleme süresi: ${loadTime}ms`);
            
            // Track page load time
            if (typeof gtag !== 'undefined') {
                gtag('event', 'timing_complete', {
                    'name': 'load',
                    'value': loadTime
                });
            }
        });
    }
    
    // Error tracking
    window.addEventListener('error', function(e) {
        console.error('JavaScript Error:', e.error);
        
        // Track error in analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'exception', {
                'description': e.error?.message || 'Unknown error',
                'fatal': false
            });
        }
    });
    
    // Add CSS for notifications
    const notificationStyles = document.createElement('style');
    notificationStyles.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        .notification-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .notification-close {
            background: none;
            border: none;
            color: white;
            font-size: 1.5rem;
            cursor: pointer;
            margin-left: 1rem;
        }
        
        .notification-close:hover {
            opacity: 0.8;
        }
        
        .search-results {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: white;
            border: 1px solid #eee;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            z-index: 1000;
            display: none;
        }
        
        .search-result-item {
            display: block;
            padding: 1rem;
            text-decoration: none;
            color: #333;
            border-bottom: 1px solid #eee;
        }
        
        .search-result-item:hover {
            background: #f8f9fa;
        }
        
        .search-result-item h4 {
            margin: 0 0 0.5rem 0;
            color: #667eea;
        }
        
        .search-result-item p {
            margin: 0;
            color: #666;
            font-size: 0.9rem;
        }
        
        .no-results {
            padding: 1rem;
            text-align: center;
            color: #666;
        }
        
        .error {
            border-color: #f44336 !important;
            box-shadow: 0 0 0 2px rgba(244, 67, 54, 0.2) !important;
        }
        
        @media (max-width: 768px) {
            .nav-menu.active {
                display: flex;
                flex-direction: column;
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                background: #667eea;
                padding: 1rem;
                box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            }
        }
    `;
    
    document.head.appendChild(notificationStyles);
    
    console.log('Puff.org.tr JavaScript loaded successfully!');
}); 