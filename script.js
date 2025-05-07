// IIFE to avoid polluting global scope
(function() {
    'use strict';
    
    // DOM Elements
    const header = document.querySelector('header');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const navLinks = document.querySelectorAll('nav a, .mobile-menu a');
    const sections = document.querySelectorAll('section');
    const fadeElements = document.querySelectorAll('.fade-in');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.querySelector('.lightbox');
    const lightboxImg = document.querySelector('.lightbox-content img');
    const closeLightbox = document.querySelector('.close-lightbox');
    const contactForm = document.querySelector('.contact-form form');
    const videoContainer = document.querySelector('.video-container');
    const heroSection = document.querySelector('#hero');
    const aboutSection = document.querySelector('#about');
    
    // Select the video element
    const heroVideo = document.querySelector('.video-container video');

    // Select the text elements
    const heroTitle = document.querySelector('.hero-content h1');
    const heroSubtitle = document.querySelector('.hero-content p');

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // ===== HEADER SCROLL EFFECT =====
    function handleHeaderScroll() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
    
    // ===== MOBILE MENU TOGGLE =====
    function toggleMobileMenu() {
        mobileMenu.classList.toggle('active');
        document.body.classList.toggle('menu-open');
        
        // Toggle hamburger icon animation
        const spans = mobileMenuBtn.querySelectorAll('span');
        spans.forEach(span => span.classList.toggle('active'));
    }
    
    // ===== SMOOTH SCROLL FOR NAV LINKS =====
    function handleNavClick(e) {
        const targetId = this.getAttribute('href');
        
        if (targetId.startsWith('#')) {
            e.preventDefault();
            
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                // Close mobile menu if open
                if (mobileMenu.classList.contains('active')) {
                    toggleMobileMenu();
                }
                
                // Calculate position accounting for fixed header
                const headerHeight = header.offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                // Smooth scroll with or without animation based on user preference
                if (prefersReducedMotion) {
                    window.scrollTo(0, targetPosition);
                } else {
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        }
    }
    
    // ===== SCROLL ANIMATIONS USING INTERSECTION OBSERVER =====
    function setupScrollAnimations() {
        if (prefersReducedMotion) {
            // If user prefers reduced motion, make all elements visible without animation
            fadeElements.forEach(el => el.classList.add('visible'));
            return;
        }
        
        // Apply initial zoom to hero video
        if (videoContainer) {
            setTimeout(() => {
                videoContainer.classList.add('zoom-out');
            }, 500);
        }
        
        // Setup hero video fade out when scrolling to About section
        const heroVideoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // When about section starts coming into view, fade out the hero video
                if (entry.isIntersecting) {
                    videoContainer.classList.add('fade-out');
                } else {
                    // Remove fade out when scrolling back up to hero
                    videoContainer.classList.remove('fade-out');
                }
            });
        }, {
            threshold: 0.1, // Trigger when 10% of about section is visible
            rootMargin: '-10% 0px 0px 0px' // Trigger a bit before reaching the about section
        });
        
        if (aboutSection) {
            heroVideoObserver.observe(aboutSection);
        }

        // Standard fade-in animations for other elements
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // Optionally, unobserve after animation is triggered
                    // observer.unobserve(entry.target);
                } else {
                    // Uncomment to re-trigger animation when element leaves viewport
                    // entry.target.classList.remove('visible');
                }
            });
        }, {
            threshold: 0.15, // Trigger when at least 15% of the element is visible
            rootMargin: '0px 0px -100px 0px' // Adjust trigger point (negative values trigger earlier)
        });
        
        fadeElements.forEach(el => observer.observe(el));
    }
    
    // ===== GALLERY LIGHTBOX =====
    function openLightbox() {
        const imgSrc = this.querySelector('img').getAttribute('src');
        lightboxImg.setAttribute('src', imgSrc);
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling when lightbox is open
    }
    
    function closeLightboxHandler() {
        lightbox.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    }
    
    // Close lightbox when clicking outside image
    function handleLightboxClick(e) {
        if (e.target === lightbox) {
            closeLightboxHandler();
        }
    }
    
    // Close lightbox with Escape key
    function handleKeyPress(e) {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightboxHandler();
        }
    }
    
    // ===== FORM VALIDATION =====
    function validateForm(e) {
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const messageInput = document.getElementById('message');
        let isValid = true;
        
        // Simple validation - ensure fields are not empty
        if (!nameInput.value.trim()) {
            isValid = false;
            highlightError(nameInput);
        } else {
            removeError(nameInput);
        }
        
        if (!emailInput.value.trim()) {
            isValid = false;
            highlightError(emailInput);
        } else if (!isValidEmail(emailInput.value)) {
            isValid = false;
            highlightError(emailInput);
        } else {
            removeError(emailInput);
        }
        
        if (!messageInput.value.trim()) {
            isValid = false;
            highlightError(messageInput);
        } else {
            removeError(messageInput);
        }
        
        if (!isValid) {
            e.preventDefault();
        }
    }
    
    function highlightError(input) {
        input.style.borderColor = 'red';
        input.style.backgroundColor = 'rgba(255, 0, 0, 0.05)';
    }
    
    function removeError(input) {
        input.style.borderColor = '';
        input.style.backgroundColor = '';
    }
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Reset form inputs when they get focus
    function handleInputFocus() {
        removeError(this);
    }
    
    // ===== INITIALIZE =====
    function init() {
        // Set up event listeners
        window.addEventListener('scroll', handleHeaderScroll);
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
        navLinks.forEach(link => link.addEventListener('click', handleNavClick));
        galleryItems.forEach(item => item.addEventListener('click', openLightbox));
        closeLightbox.addEventListener('click', closeLightboxHandler);
        lightbox.addEventListener('click', handleLightboxClick);
        document.addEventListener('keydown', handleKeyPress);
        
        if (contactForm) {
            contactForm.addEventListener('submit', validateForm);
            const formInputs = contactForm.querySelectorAll('input, textarea');
            formInputs.forEach(input => input.addEventListener('focus', handleInputFocus));
        }
        
        // Setup scroll animations
        setupScrollAnimations();
        
        // Trigger header styling on page load
        handleHeaderScroll();

        // Add a scroll event listener
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY; // Get the vertical scroll position
            const heroHeight = heroSection.offsetHeight; // Get the height of the hero section

            // Calculate the scale factor (start at 0.6, grow to 1.2)
            const scaleFactor = 0.6 + Math.min(scrollY / heroHeight, 0.2);

            // Apply the scale transformation to the video
            heroVideo.style.transform = `scale(${scaleFactor})`;

            // Trigger animations for the text elements
            if (scaleFactor >= 0.8) {
                heroTitle.classList.add('up'); // Add upward fade animation
                heroSubtitle.classList.add('down'); // Add downward fade animation
            } else {
                heroTitle.classList.remove('up'); // Reset upward fade animation
                heroSubtitle.classList.remove('down'); // Reset downward fade animation
            }
        });
    }
    
    // Run initialization when DOM is fully loaded
    document.addEventListener('DOMContentLoaded', init);
})();