// ========================================
// AUTO CAR SERVICE CENTER - MAIN JAVASCRIPT
// Optimized for Fast Mobile Loading
// ========================================

// Wait for DOM to load - but don't block rendering
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init(); // DOM already loaded
}

function init() {
    // Initialize all features
    setupMobileMenu();
    setupFloatingButtons();
    setupSmoothScroll();
    setupReviewSystem();
    setupQuoteForm();
    setupMap();
    setupShareButtons();
    setupSaveButton();
    setupSendToPhone();
}

// ========================================
// 1. MOBILE MENU - Fast & Smooth
// ========================================
function setupMobileMenu() {
    const menuBtn = document.getElementById('menuBtn');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    if (!menuBtn || !navMenu) return;
    
    menuBtn.addEventListener('click', (e) => {
        e.preventDefault();
        menuBtn.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        if (navMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });
    
    // Close menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuBtn.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && 
            !menuBtn.contains(e.target) && 
            navMenu.classList.contains('active')) {
            menuBtn.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// ========================================
// 2. FLOATING BUTTONS - Show on Scroll
// ========================================
function setupFloatingButtons() {
    const callFloat = document.getElementById('callFloat');
    if (!callFloat) return;
    
    // Use passive event listener for better scroll performance
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            callFloat.classList.add('visible');
        } else {
            callFloat.classList.remove('visible');
        }
    }, { passive: true });
    
    // Check initial scroll position
    if (window.scrollY > 300) {
        callFloat.classList.add('visible');
    }
}

// ========================================
// 3. SMOOTH SCROLL - For Navigation
// ========================================
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const href = anchor.getAttribute('href');
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const headerOffset = 70;
                const elementPosition = target.offsetTop;
                const offsetPosition = elementPosition - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ========================================
// 4. REVIEW SYSTEM - REAL Reviews with Storage
// ========================================
function setupReviewSystem() {
    const addReviewBtn = document.getElementById('addReviewBtn');
    const reviewForm = document.getElementById('reviewForm');
    const submitReview = document.getElementById('submitReview');
    const reviewsSlider = document.getElementById('reviewsSlider');
    
    if (!addReviewBtn || !reviewForm || !submitReview || !reviewsSlider) return;
    
    // Load saved reviews from localStorage
    loadSavedReviews();
    
    // Toggle review form
    addReviewBtn.addEventListener('click', () => {
        if (reviewForm.style.display === 'none' || reviewForm.style.display === '') {
            reviewForm.style.display = 'block';
            reviewForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
            reviewForm.style.display = 'none';
        }
    });
    
    // Submit review
    submitReview.addEventListener('click', () => {
        const name = document.getElementById('reviewerName')?.value.trim();
        const car = document.getElementById('reviewerCar')?.value.trim();
        const rating = document.getElementById('reviewRating')?.value;
        const message = document.getElementById('reviewMessage')?.value.trim();
        
        // Validate
        if (!name) {
            showNotification('Please enter your name', 'error');
            document.getElementById('reviewerName').style.borderColor = '#C6A43F';
            return;
        }
        
        if (!message) {
            showNotification('Please write your review', 'error');
            document.getElementById('reviewMessage').style.borderColor = '#C6A43F';
            return;
        }
        
        if (message.length < 5) {
            showNotification('Review too short', 'error');
            document.getElementById('reviewMessage').style.borderColor = '#C6A43F';
            return;
        }
        
        // Create star rating
        const stars = '⭐'.repeat(parseInt(rating));
        
        // Create review object
        const newReview = {
            name: name,
            car: car || 'Car Owner',
            rating: parseInt(rating),
            message: message,
            date: new Date().toLocaleDateString()
        };
        
        // Add to page
        addReviewToSlider(newReview, stars);
        
        // Save to localStorage
        saveReview(newReview);
        
        // Update review count and rating
        updateReviewStats();
        
        // Show success
        showNotification('Thank you for your review! 🌟', 'success');
        
        // Reset form
        document.getElementById('reviewerName').value = '';
        document.getElementById('reviewerCar').value = '';
        document.getElementById('reviewMessage').value = '';
        document.getElementById('reviewRating').value = '5';
        
        // Hide form
        reviewForm.style.display = 'none';
        
        // Reset borders
        document.getElementById('reviewerName').style.borderColor = '';
        document.getElementById('reviewMessage').style.borderColor = '';
    });
    
    // Clear border on input
    document.getElementById('reviewerName')?.addEventListener('input', function() {
        this.style.borderColor = '';
    });
    
    document.getElementById('reviewMessage')?.addEventListener('input', function() {
        this.style.borderColor = '';
    });
}

// Add review to slider
function addReviewToSlider(review, stars) {
    const reviewsSlider = document.getElementById('reviewsSlider');
    
    const reviewCard = document.createElement('div');
    reviewCard.className = 'review-card';
    reviewCard.innerHTML = `
        <div class="review-stars">
            ${stars}
        </div>
        <p class="review-text">"${review.message}"</p>
        <div class="reviewer">
            <strong>${review.name}</strong>
            <span>${review.car}</span>
            <small style="display: block; color: #999; font-size: 0.7rem; margin-top: 0.3rem;">${review.date}</small>
        </div>
    `;
    
    // Add animation
    reviewCard.style.animation = 'slideIn 0.5s ease';
    
    // Add to beginning of slider
    reviewsSlider.insertBefore(reviewCard, reviewsSlider.firstChild);
    
    // Scroll to new review
    setTimeout(() => {
        reviewCard.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
    }, 100);
}

// Save review to localStorage
function saveReview(review) {
    let reviews = JSON.parse(localStorage.getItem('garageReviews')) || [];
    reviews.unshift(review); // Add to beginning
    localStorage.setItem('garageReviews', JSON.stringify(reviews));
}

// Load saved reviews
function loadSavedReviews() {
    const reviews = JSON.parse(localStorage.getItem('garageReviews'));
    if (!reviews || reviews.length === 0) return;
    
    const reviewsSlider = document.getElementById('reviewsSlider');
    
    // Clear existing reviews (keep the first 3 original ones? Or replace all?)
    // Let's keep originals and add saved ones after
    reviews.forEach(review => {
        const stars = '⭐'.repeat(review.rating);
        
        const reviewCard = document.createElement('div');
        reviewCard.className = 'review-card';
        reviewCard.innerHTML = `
            <div class="review-stars">
                ${stars}
            </div>
            <p class="review-text">"${review.message}"</p>
            <div class="reviewer">
                <strong>${review.name}</strong>
                <span>${review.car}</span>
                <small style="display: block; color: #999; font-size: 0.7rem; margin-top: 0.3rem;">${review.date || ''}</small>
            </div>
        `;
        
        reviewsSlider.appendChild(reviewCard);
    });
    
    // Update stats
    updateReviewStats();
}

// Update review statistics
function updateReviewStats() {
    const reviews = JSON.parse(localStorage.getItem('garageReviews')) || [];
    const totalReviews = 33 + reviews.length; // Original 33 + new reviews
    
    // Calculate average rating
    let totalRating = 33 * 4.5; // Original total
    reviews.forEach(review => {
        totalRating += review.rating;
    });
    const avgRating = (totalRating / totalReviews).toFixed(1);
    
    // Update display
    const ratingLarge = document.querySelector('.rating-large');
    const ratingCount = document.querySelector('.rating-count');
    const starsLarge = document.querySelector('.rating-stars-large');
    
    if (ratingLarge) ratingLarge.textContent = avgRating;
    if (ratingCount) ratingCount.textContent = `Based on ${totalReviews} reviews`;
    
    // Update stars (simplified)
    if (starsLarge) {
        const fullStars = Math.floor(avgRating);
        const hasHalf = avgRating % 1 >= 0.5;
        let starsHtml = '';
        for (let i = 0; i < 5; i++) {
            if (i < fullStars) {
                starsHtml += '<i class="fas fa-star"></i>';
            } else if (i === fullStars && hasHalf) {
                starsHtml += '<i class="fas fa-star-half-alt"></i>';
            } else {
                starsHtml += '<i class="far fa-star"></i>';
            }
        }
        starsLarge.innerHTML = starsHtml;
    }
}

// ========================================
// 5. QUOTE FORM - Send to WhatsApp/Email
// ========================================
function setupQuoteForm() {
    const quoteForm = document.getElementById('quoteForm');
    if (!quoteForm) return;
    
    quoteForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const name = quoteForm.querySelector('input[placeholder="Your Name"]')?.value;
        const phone = quoteForm.querySelector('input[placeholder="Phone Number"]')?.value;
        const carModel = quoteForm.querySelector('input[placeholder="Car Model"]')?.value;
        const carBrand = quoteForm.querySelector('select:first-of-type')?.value;
        const service = quoteForm.querySelector('select:last-of-type')?.value;
        const message = quoteForm.querySelector('textarea')?.value;
        
        if (!name || !phone) {
            showNotification('Please fill in your name and phone number', 'error');
            return;
        }
        
        // Create WhatsApp message
        const whatsappMessage = `*New Service Request from Website*%0A%0A
*Name:* ${name}%0A
*Phone:* ${phone}%0A
*Car:* ${carBrand || 'Not specified'} ${carModel ? '- ' + carModel : ''}%0A
*Service:* ${service || 'Not specified'}%0A
*Message:* ${message || 'No message'}`.replace(/\s+/g, ' ');
        
        // Open WhatsApp
        const whatsappUrl = `https://wa.me/971543027978?text=${whatsappMessage}`;
        window.open(whatsappUrl, '_blank');
        
        // Also send as SMS backup (optional)
        const smsMessage = `Service Request: ${name}, ${phone}, ${carBrand} ${carModel}, ${service}`;
        
        showNotification('Opening WhatsApp to send your request! 💬', 'success');
        
        // Optional: Store in localStorage
        saveQuoteRequest({ name, phone, carModel, carBrand, service, message, date: new Date().toISOString() });
        
        // Reset form
        quoteForm.reset();
    });
}

// Save quote requests (for admin later)
function saveQuoteRequest(request) {
    let requests = JSON.parse(localStorage.getItem('quoteRequests')) || [];
    requests.unshift(request);
    localStorage.setItem('quoteRequests', JSON.stringify(requests));
}

// ========================================
// 6. MAP SETUP - Fast Loading
// ========================================
function setupMap() {
    const mapElement = document.getElementById('map');
    if (!mapElement || typeof L === 'undefined') return;
    
    // Use setTimeout to not block rendering
    setTimeout(() => {
        try {
            // Coordinates for Aweer Road, Dubai
            const map = L.map('map').setView([25.118, 55.235], 15);
            
            L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
                attribution: '©OpenStreetMap, ©CartoDB',
                maxZoom: 19
            }).addLayer(map);
            
            // Add marker
            const marker = L.marker([25.118, 55.235]).addLayer(map);
            marker.bindPopup(`
                <b>Auto Car Service Center</b><br>
                Aweer Road, Dubai<br>
                <span style="color: #C6A43F;">⭐ 4.5 (33 reviews)</span>
            `).openPopup();
            
            // Add circle for accuracy
            L.circle([25.118, 55.235], {
                color: '#C6A43F',
                fillColor: '#C6A43F',
                fillOpacity: 0.1,
                radius: 50
            }).addLayer(map);
            
        } catch (error) {
            console.log('Map loading deferred');
        }
    }, 100);
}

// ========================================
// 7. SHARE BUTTON - Share Business
// ========================================
function setupShareButtons() {
    const shareBtn = document.getElementById('shareBtn');
    const shareContactBtn = document.getElementById('shareContactBtn');
    
    const shareData = {
        title: 'Auto Car Service Center',
        text: 'Professional auto electrical service in Dubai. 4.5 ⭐ rating!',
        url: window.location.href
    };
    
    if (shareBtn) {
        shareBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            
            if (navigator.share) {
                try {
                    await navigator.share(shareData);
                    showNotification('Thanks for sharing! 🤝', 'success');
                } catch (err) {
                    if (err.name !== 'AbortError') {
                        fallbackShare();
                    }
                }
            } else {
                fallbackShare();
            }
        });
    }
    
    if (shareContactBtn) {
        shareContactBtn.addEventListener('click', (e) => {
            e.preventDefault();
            fallbackShare();
        });
    }
    
    function fallbackShare() {
        // Copy to clipboard
        const textToCopy = `Auto Car Service Center\nAweer Road, Dubai\n📞 +971 54 302 7978\n⭐ 4.5 (33 reviews)`;
        
        if (navigator.clipboard) {
            navigator.clipboard.writeText(textToCopy).then(() => {
                showNotification('Business info copied! 📋', 'success');
            }).catch(() => {
                prompt('Copy this info:', textToCopy);
            });
        } else {
            prompt('Copy this info:', textToCopy);
        }
    }
}

// ========================================
// 8. SAVE BUTTON - Save to Browser
// ========================================
function setupSaveButton() {
    const saveBtn = document.getElementById('saveBtn');
    if (!saveBtn) return;
    
    // Check if already saved
    const isSaved = localStorage.getItem('garageSaved') === 'true';
    if (isSaved) {
        saveBtn.innerHTML = '<i class="fas fa-bookmark"></i><span>Saved</span>';
        saveBtn.style.background = 'rgba(198, 164, 63, 0.2)';
    }
    
    saveBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        const saved = localStorage.getItem('garageSaved') === 'true';
        
        if (!saved) {
            // Save business
            localStorage.setItem('garageSaved', 'true');
            saveBtn.innerHTML = '<i class="fas fa-bookmark"></i><span>Saved</span>';
            saveBtn.style.background = 'rgba(198, 164, 63, 0.2)';
            showNotification('Business saved to your list! 💾', 'success');
        } else {
            // Unsave
            localStorage.removeItem('garageSaved');
            saveBtn.innerHTML = '<i class="far fa-bookmark"></i><span>Save</span>';
            saveBtn.style.background = '';
            showNotification('Removed from saved list', 'info');
        }
    });
}

// ========================================
// 9. SEND TO PHONE - SMS Link
// ========================================
function setupSendToPhone() {
    const sendToPhone = document.getElementById('sendToPhone');
    if (!sendToPhone) return;
    
    sendToPhone.addEventListener('click', (e) => {
        e.preventDefault();
        
        const phone = prompt('Enter your phone number:', '+971');
        
        if (phone && phone.length > 5) {
            const message = `Check out Auto Car Service Center in Dubai!\nAweer Road\n⭐ 4.5 (33 reviews)\n📞 +971 54 302 7978\n${window.location.href}`;
            
            // Try to send via SMS intent
            const smsUrl = `sms:${phone}?body=${encodeURIComponent(message)}`;
            window.location.href = smsUrl;
            
            showNotification('Opening SMS app... 📱', 'info');
        }
    });
}

// ========================================
// 10. NOTIFICATION SYSTEM
// ========================================
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        left: 50%;
        transform: translateX(-50%);
        background: ${type === 'success' ? '#C6A43F' : type === 'error' ? '#1A1A1A' : '#2D2D2D'};
        color: ${type === 'success' ? '#1A1A1A' : '#FFFFFF'};
        padding: 12px 24px;
        border-radius: 50px;
        font-weight: 500;
        font-size: 14px;
        z-index: 9999;
        box-shadow: 0 5px 20px rgba(0,0,0,0.2);
        animation: slideDown 0.3s ease;
        border: 2px solid ${type === 'success' ? '#1A1A1A' : '#C6A43F'};
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideUp 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ========================================
// 11. LAZY LOAD IMAGES - For Speed
// ========================================
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                }
                imageObserver.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ========================================
// 12. ADD CSS ANIMATIONS
// ========================================
const style = document.createElement('style');
style.textContent = `
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translate(-50%, -20px);
        }
        to {
            opacity: 1;
            transform: translate(-50%, 0);
        }
    }
    
    @keyframes slideUp {
        from {
            opacity: 1;
            transform: translate(-50%, 0);
        }
        to {
            opacity: 0;
            transform: translate(-50%, -20px);
        }
    }
    
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateX(30px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    .notification {
        pointer-events: none;
        text-align: center;
        max-width: 90%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    
    @media (max-width: 480px) {
        .notification {
            white-space: normal;
            width: 90%;
            text-align: center;
        }
    }
`;
document.head.appendChild(style);