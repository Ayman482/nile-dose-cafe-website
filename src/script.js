// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
    // Language Toggle
    const langButtons = document.querySelectorAll('.lang-btn');
    const htmlElement = document.documentElement;
    
    langButtons.forEach(button => {
        button.addEventListener('click', () => {
            const lang = button.getAttribute('data-lang');
            htmlElement.setAttribute('lang', lang);
            
            // Update active class
            langButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Save language preference
            localStorage.setItem('preferredLanguage', lang);
        });
    });
    
    // Load saved language preference
    const savedLanguage = localStorage.getItem('preferredLanguage') || 'en';
    htmlElement.setAttribute('lang', savedLanguage);
    
    // Update active class for language buttons
    document.querySelector(`.lang-btn[data-lang="${savedLanguage}"]`).classList.add('active');
    
    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const languageToggle = document.querySelector('.language-toggle');
    
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenuBtn.classList.toggle('active');
        navLinks.classList.toggle('show');
        languageToggle.classList.toggle('show');
        
        if (mobileMenuBtn.classList.contains('active')) {
            mobileMenuBtn.querySelector('span:nth-child(1)').style.transform = 'rotate(-45deg) translate(-5px, 6px)';
            mobileMenuBtn.querySelector('span:nth-child(2)').style.opacity = '0';
            mobileMenuBtn.querySelector('span:nth-child(3)').style.transform = 'rotate(45deg) translate(-5px, -6px)';
        } else {
            mobileMenuBtn.querySelector('span:nth-child(1)').style.transform = 'none';
            mobileMenuBtn.querySelector('span:nth-child(2)').style.opacity = '1';
            mobileMenuBtn.querySelector('span:nth-child(3)').style.transform = 'none';
        }
    });
    
    // Menu Tabs
    const menuTabs = document.querySelectorAll('.menu-tab');
    const menuItems = document.querySelectorAll('.menu-items');
    
    menuTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const category = tab.getAttribute('data-category');
            
            // Update active tab
            menuTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Show corresponding menu items
            menuItems.forEach(item => {
                item.classList.remove('active');
                if (item.classList.contains(category)) {
                    item.classList.add('active');
                }
            });
        });
    });
    
    // Smooth Scrolling for Navigation Links
    const navLinksAnchors = document.querySelectorAll('.nav-links a, .footer-links a');
    
    navLinksAnchors.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            const headerHeight = document.querySelector('header').offsetHeight;
            
            window.scrollTo({
                top: targetElement.offsetTop - headerHeight,
                behavior: 'smooth'
            });
            
            // Close mobile menu if open
            if (navLinks.classList.contains('show')) {
                mobileMenuBtn.click();
            }
        });
    });
    
    // Contact Form Submission
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                message: document.getElementById('message').value
            };
            
            // Here you would typically send the data to a server
            // For now, we'll just show a success message
            alert('Thank you for your message! We will get back to you soon.');
            contactForm.reset();
        });
    }
    
    // Header Scroll Effect
    const header = document.querySelector('header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
            header.style.background = '#fff';
        } else {
            header.style.boxShadow = 'none';
            header.style.background = '#fff';
        }
    });
    
    // Gallery Image Modal (Lightbox)
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const imgSrc = item.querySelector('img').src;
            
            // Create modal elements
            const modal = document.createElement('div');
            modal.classList.add('gallery-modal');
            
            const modalContent = document.createElement('div');
            modalContent.classList.add('gallery-modal-content');
            
            const closeBtn = document.createElement('span');
            closeBtn.classList.add('gallery-modal-close');
            closeBtn.innerHTML = '&times;';
            
            const img = document.createElement('img');
            img.src = imgSrc;
            
            // Append elements
            modalContent.appendChild(closeBtn);
            modalContent.appendChild(img);
            modal.appendChild(modalContent);
            document.body.appendChild(modal);
            
            // Prevent scrolling when modal is open
            document.body.style.overflow = 'hidden';
            
            // Close modal when clicking close button or outside the image
            closeBtn.addEventListener('click', closeModal);
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    closeModal();
                }
            });
            
            function closeModal() {
                document.body.removeChild(modal);
                document.body.style.overflow = 'auto';
            }
        });
    });
});
