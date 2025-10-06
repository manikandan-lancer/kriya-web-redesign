// Enhanced Navigation and Dropdown functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('Kriya Ltd website initialized');

    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const body = document.body;
    
    // Enhanced mobile menu functionality with smooth animations
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function(e) {
            e.stopPropagation();
            const isActive = !hamburger.classList.contains('active');
            
            // Smooth toggle with requestAnimationFrame for better performance
            requestAnimationFrame(() => {
                hamburger.classList.toggle('active', isActive);
                navMenu.classList.toggle('active', isActive);
                body.classList.toggle('menu-open', isActive);
            });
        });
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (navMenu && navMenu.classList.contains('active') && 
            !e.target.closest('.nav-menu') && 
            !e.target.closest('.hamburger')) {
            closeMobileMenu();
        }
    });

    // Close mobile menu on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navMenu && navMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    });

    // Close mobile menu function
    function closeMobileMenu() {
        if (hamburger && navMenu) {
            requestAnimationFrame(() => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                body.classList.remove('menu-open');
                
                // Close all dropdowns
                document.querySelectorAll('.dropdown, .dropdown-category').forEach(item => {
                    item.classList.remove('active');
                });
            });
        }
    }

    // Enhanced mobile dropdown functionality
    const dropdowns = document.querySelectorAll('.dropdown');
    const dropdownCategories = document.querySelectorAll('.dropdown-category');
    
    // Handle dropdown clicks on mobile
    dropdowns.forEach(dropdown => {
        const link = dropdown.querySelector('.nav-link');
        
        link.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                e.stopPropagation();
                
                const isActive = !dropdown.classList.contains('active');
                
                // Smooth dropdown toggle
                requestAnimationFrame(() => {
                    dropdown.classList.toggle('active', isActive);
                    
                    // Close other dropdowns
                    if (isActive) {
                        dropdowns.forEach(otherDropdown => {
                            if (otherDropdown !== dropdown) {
                                otherDropdown.classList.remove('active');
                            }
                        });
                        
                        // Close all categories when opening new dropdown
                        dropdownCategories.forEach(category => {
                            category.classList.remove('active');
                        });
                    }
                });
            }
        });
    });

    // Handle dropdown category clicks on mobile - FIXED FOR REDIRECT
    dropdownCategories.forEach(category => {
        const link = category.querySelector('a');
        const hasSubcategories = category.querySelector('.subcategory-menu');
        
        if (link) {
            link.addEventListener('click', function(e) {
                if (window.innerWidth <= 768) {
                    // Only prevent default if there are subcategories
                    if (hasSubcategories) {
                        e.preventDefault();
                        e.stopPropagation();
                        
                        const isActive = !category.classList.contains('active');
                        
                        requestAnimationFrame(() => {
                            category.classList.toggle('active', isActive);
                            
                            // Close other categories in the same dropdown
                            if (isActive) {
                                const parentDropdown = category.closest('.dropdown');
                                if (parentDropdown) {
                                    parentDropdown.querySelectorAll('.dropdown-category').forEach(otherCategory => {
                                        if (otherCategory !== category) {
                                            otherCategory.classList.remove('active');
                                        }
                                    });
                                }
                            }
                        });
                    }
                    // If no subcategories, allow normal link behavior (redirect)
                }
            });
        }
    });

    // Enhanced desktop dropdown functionality
    let closeTimeout;
    const closeDelay = 200; // Slightly longer for better UX

    function setupDesktopDropdowns() {
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

        // Setup category hover for desktop
        dropdownCategories.forEach(category => {
            const submenu = category.querySelector('.subcategory-menu');
            
            if (submenu) {
                category.addEventListener('mouseenter', function() {
                    clearTimeout(closeTimeout);
                    this.classList.add('active');
                });
                
                category.addEventListener('mouseleave', function() {
                    closeTimeout = setTimeout(() => {
                        this.classList.remove('active');
                    }, closeDelay);
                });

                submenu.addEventListener('mouseenter', function() {
                    clearTimeout(closeTimeout);
                });
                
                submenu.addEventListener('mouseleave', function() {
                    closeTimeout = setTimeout(() => {
                        category.classList.remove('active');
                    }, closeDelay);
                });
            }
        });
    }

    // Close mobile menu when clicking on regular links
    const navLinks = document.querySelectorAll('.nav-link:not(.dropdown > .nav-link):not(.dropdown-category > a)');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                // Allow default behavior for external links
                if (this.getAttribute('href') && !this.getAttribute('href').startsWith('#')) {
                    closeMobileMenu();
                }
                
                // Set active link
                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });

    // Handle window resize
    function handleResize() {
        if (window.innerWidth > 768) {
            // Reset mobile states when switching to desktop
            closeMobileMenu();
            setupDesktopDropdowns();
        } else {
            // Clear any desktop hover timeouts
            clearTimeout(closeTimeout);
        }
    }

    // Debounced resize handler
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(handleResize, 100);
    });

    // Initial setup based on screen size
    if (window.innerWidth > 768) {
        setupDesktopDropdowns();
    }

    // Set active navigation link based on current page
    function setActiveNavLink() {
        const currentPage = window.location.pathname;
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            
            let linkHref = link.getAttribute('href');
            if (!linkHref) return;
            
            // Handle relative paths
            if (linkHref.startsWith('./')) {
                linkHref = linkHref.substring(1);
            }
            
            // Check if current page matches the link href
            if (currentPage.endsWith(linkHref) || 
                (currentPage.endsWith('/') && (linkHref === 'index.html' || linkHref === './index.html'))) {
                link.classList.add('active');
            }
            
            // Special handling for nested pages
            if (currentPage.includes('/products/') && linkHref.includes('products/')) {
                if (currentPage.includes(linkHref)) {
                    link.classList.add('active');
                }
            }
            
            if (currentPage.includes('/technology/') && linkHref.includes('technology/')) {
                if (currentPage.includes(linkHref)) {
                    link.classList.add('active');
                }
            }
        });
    }

    // Initialize active navigation
    setActiveNavLink();

    // Enhanced tooltip functionality with fallback
    function setupTooltips() {
        const tooltipItems = document.querySelectorAll('.subcategory-item[data-tooltip]');
        
        tooltipItems.forEach(item => {
            // Remove default title to prevent double tooltips
            const tooltipText = item.getAttribute('data-tooltip');
            if (item.getAttribute('title') === tooltipText) {
                item.removeAttribute('title');
            }
            
            // Ensure tooltips work on desktop
            if (window.innerWidth > 768) {
                // Add manual tooltip as fallback
                let tooltipElement = null;
                let tooltipTimer;
                
                item.addEventListener('mouseenter', function(e) {
                    tooltipTimer = setTimeout(() => {
                        createManualTooltip(this, e);
                    }, 200);
                });
                
                item.addEventListener('mouseleave', function() {
                    clearTimeout(tooltipTimer);
                    removeManualTooltip();
                });
                
                item.addEventListener('mousemove', function(e) {
                    if (tooltipElement) {
                        updateTooltipPosition(e);
                    }
                });
                
                function createManualTooltip(element, event) {
                    // Remove existing tooltip
                    removeManualTooltip();
                    
                    // Create new tooltip
                    tooltipElement = document.createElement('div');
                    tooltipElement.className = 'manual-tooltip';
                    tooltipElement.textContent = element.getAttribute('data-tooltip');
                    tooltipElement.style.cssText = `
                        position: fixed;
                        background: var(--primary-dark);
                        color: var(--white);
                        padding: 0.6rem 0.8rem;
                        border-radius: 6px;
                        font-size: 0.75rem;
                        font-weight: 500;
                        white-space: nowrap;
                        z-index: 10050;
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                        border: 1px solid var(--border-light);
                        pointer-events: none;
                        opacity: 0;
                        transition: opacity 0.2s ease;
                    `;
                    
                    document.body.appendChild(tooltipElement);
                    updateTooltipPosition(event);
                    
                    // Fade in
                    setTimeout(() => {
                        if (tooltipElement) {
                            tooltipElement.style.opacity = '1';
                        }
                    }, 10);
                }
                
                function updateTooltipPosition(event) {
                    if (!tooltipElement) return;
                    
                    const x = event.clientX + 15;
                    const y = event.clientY - 10;
                    
                    tooltipElement.style.left = x + 'px';
                    tooltipElement.style.top = y + 'px';
                }
                
                function removeManualTooltip() {
                    if (tooltipElement) {
                        tooltipElement.remove();
                        tooltipElement = null;
                    }
                }
            }
            
            // Disable tooltips on mobile
            item.addEventListener('touchstart', function(e) {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                }
            }, { passive: false });
        });
    }

    setupTooltips();

    // Fix for tooltip positioning in nested dropdowns
    function fixTooltipZIndex() {
        const dropdownMenus = document.querySelectorAll('.dropdown-menu');
        const subcategoryMenus = document.querySelectorAll('.subcategory-menu');
        
        // Ensure tooltips appear above all dropdown content
        dropdownMenus.forEach(menu => {
            menu.style.zIndex = '1001';
        });
        
        subcategoryMenus.forEach(menu => {
            menu.style.zIndex = '1002';
        });
    }

    fixTooltipZIndex();
});

// Your existing product data and utility functions...
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
    ]
};

function formatProductName(name) {
    if (!name) return '';
    return name.replace(/\s+/g, '-').toLowerCase();
}

window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
});

// Add manual tooltip styles
const manualTooltipStyles = `
.manual-tooltip {
    position: fixed !important;
    z-index: 10050 !important;
    background: var(--primary-dark) !important;
    color: var(--white) !important;
    padding: 0.6rem 0.8rem !important;
    border-radius: 6px !important;
    font-size: 0.75rem !important;
    font-weight: 500 !important;
    white-space: nowrap !important;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
    border: 1px solid var(--border-light) !important;
    pointer-events: none !important;
    opacity: 0;
    transition: opacity 0.2s ease !important;
}
`;

// Inject manual tooltip styles
const styleSheet = document.createElement('style');
styleSheet.textContent = manualTooltipStyles;
document.head.appendChild(styleSheet);