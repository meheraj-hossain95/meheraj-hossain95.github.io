document.addEventListener('DOMContentLoaded', function () {

    // ── Mobile "Home ▾" nav dropdown ─────────────────────────────────────
    const navHomeBtn = document.getElementById('navHomeBtn');
    const navHomeSub = document.getElementById('navHomeSub');

    if (navHomeBtn && navHomeSub) {
        navHomeBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            const open = navHomeSub.classList.toggle('open');
            navHomeBtn.classList.toggle('active-dropdown', open);
        });

        navHomeSub.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                navHomeSub.classList.remove('open');
                navHomeBtn.classList.remove('active-dropdown');
            });
        });

        document.addEventListener('click', function () {
            navHomeSub.classList.remove('open');
            navHomeBtn.classList.remove('active-dropdown');
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') {
                navHomeSub.classList.remove('open');
                navHomeBtn.classList.remove('active-dropdown');
            }
        });
    }

    // ── Smooth scroll for anchor links ───────────────────────────────────
    document.querySelectorAll('nav a[href^="#"]').forEach(function (link) {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const href = this.getAttribute('href');

            // If clicking name (href="#"), scroll to top
            if (href === '#') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                const target = document.querySelector(href);
                if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ── Active section indicator ─────────────────────────────────────────
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    const navHomeButton = document.getElementById('navHomeBtn');

    function updateActiveNav() {
        const sections = [
            { id: 'skills', element: document.getElementById('skills') },
            { id: 'projects', element: document.getElementById('projects') },
            { id: 'achievements', element: document.getElementById('achievements') }
        ].filter(s => s.element);

        let currentSection = 'skills'; // Default to skills section
        const scrollY = window.scrollY;
        const navHeight = document.querySelector('nav').offsetHeight;

        // Check sections from bottom to top
        for (let i = sections.length - 1; i >= 0; i--) {
            const section = sections[i];
            const elementTop = section.element.offsetTop;

            // If we've scrolled past this section (with offset for nav)
            if (scrollY + navHeight + 20 >= elementTop) {
                currentSection = section.id;
                break;
            }
        }

        // Update all nav links
        navLinks.forEach(function(link) {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === '#' + currentSection) {
                link.classList.add('active');
            }
        });

        // Update mobile nav button and dropdown links
        if (navHomeButton) {
            const dropdownLinks = document.querySelectorAll('.nav-home-sub a');

            dropdownLinks.forEach(function(link) {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + currentSection) {
                    link.classList.add('active');
                }
            });
        }
    }

    window.addEventListener('scroll', updateActiveNav);
    window.addEventListener('load', updateActiveNav);
    setTimeout(updateActiveNav, 100);
    updateActiveNav();

});
