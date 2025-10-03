// Navigation and Dropdown functionality
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Dropdown menu functionality with delays
    const dropdowns = document.querySelectorAll('.dropdown');
    let closeTimeout;
    const closeDelay = 120; // ms

    dropdowns.forEach(dropdown => {
        const menu = dropdown.querySelector('.dropdown-menu');
        
        dropdown.addEventListener('mouseenter', function() {
            clearTimeout(closeTimeout);
            this.classList.add('active');
        });
        
        dropdown.addEventListener('mouseleave', function() {
            closeTimeout = setTimeout(() => {
                this.classList.remove('active');
            }, closeDelay);
        });

        // Keep menu open when moving to dropdown
        if (menu) {
            menu.addEventListener('mouseenter', function() {
                clearTimeout(closeTimeout);
            });
            
            menu.addEventListener('mouseleave', function() {
                closeTimeout = setTimeout(() => {
                    dropdown.classList.remove('active');
                }, closeDelay);
            });
        }
    });

    // Close mobile menu when clicking on links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Contact form handling
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const name = formData.get('name');
            const company = formData.get('company');
            const country = formData.get('country');
            const email = formData.get('email');
            const whatsapp = formData.get('whatsapp');
            const productInterest = formData.get('product-interest');
            const message = formData.get('message');
            
            // Compose email
            const subject = `Sales Inquiry from ${name} - ${company}`;
            const body = `
Name: ${name}
Company: ${company}
Country: ${country}
Email: ${email}
WhatsApp: ${whatsapp || 'Not provided'}
Product Interest: ${productInterest}

Message:
${message}
            `.trim();
            
            // Open mail client
            window.location.href = `mailto:info@kriya.ltd?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        });
    }

    // Smooth scrolling for anchor links
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

    // Add loading animation for images
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('load', function() {
            this.style.opacity = '1';
        });
        img.style.transition = 'opacity 0.3s ease';
        img.style.opacity = '0';
    });

    // Header scroll effect
    let lastScrollTop = 0;
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down
            navbar.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });

    // Tooltip enhancement
    const tooltipItems = document.querySelectorAll('[data-tooltip]');
    tooltipItems.forEach(item => {
        item.addEventListener('mouseenter', function(e) {
            // Additional tooltip logic if needed
        });
    });
});

// Product data handling (for dynamic content)
const productData = {
    biocontrol: [
        {
            brandName: "Ecoza",
            activeIngredient: "Azadirachtin",
            toolTip: "Azadirachtin",
            variants: [
                { variant: "Max", variationDetails: "Azadirachtin (3%) EC" },
                { variant: "Ace", variationDetails: "Azadirachtin (1.2%) EC" },
                { variant: "Rix", variationDetails: "Azadirachtin (1.2%) EC" },
                { variant: "Pro", variationDetails: "Azadirachtin (0.3%) EC" }
            ],
            cfu: null
        }
        // ... other products would be defined here
    ]
    // ... other categories
};

// Utility function to format product names
function formatProductName(name) {
    return name.replace(/\s+/g, '-').toLowerCase();
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('Kriya Ltd website initialized');
});
