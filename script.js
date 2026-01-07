// Mobile Menu Toggle Functionality

document.addEventListener('DOMContentLoaded', function () {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const socialSidebar = document.getElementById('socialSidebar');
    const mobileOverlay = document.getElementById('mobileOverlay');

    // Toggle menu function
    function toggleMenu() {
        mobileMenuBtn.classList.toggle('active');
        socialSidebar.classList.toggle('active');
        mobileOverlay.classList.toggle('active');
    }

    // Close menu function
    function closeMenu() {
        mobileMenuBtn.classList.remove('active');
        socialSidebar.classList.remove('active');
        mobileOverlay.classList.remove('active');
    }

    // Event listener for menu button
    mobileMenuBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        toggleMenu();
    });

    // Event listener for overlay (click outside to close)
    mobileOverlay.addEventListener('click', function () {
        closeMenu();
    });

    // Close menu when clicking on a link in the sidebar
    const sidebarLinks = socialSidebar.querySelectorAll('a');
    sidebarLinks.forEach(function (link) {
        link.addEventListener('click', closeMenu);
    });

    // Close menu on escape key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && socialSidebar.classList.contains('active')) {
            closeMenu();
        }
    });

    // Smooth scroll for anchor links
    const anchorLinks = document.querySelectorAll('nav a[href^="#"]');
    anchorLinks.forEach(function (link) {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});
