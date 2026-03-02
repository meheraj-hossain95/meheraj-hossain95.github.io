document.addEventListener('DOMContentLoaded', function () {

    // ── Mobile "Home ▾" nav dropdown ─────────────────────────────────────
    const navHomeBtn = document.getElementById('navHomeBtn');
    const navHomeSub = document.getElementById('navHomeSub');

    if (navHomeBtn && navHomeSub) {
        navHomeBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            const open = navHomeSub.classList.toggle('open');
            navHomeBtn.classList.toggle('active', open);
        });

        navHomeSub.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                navHomeSub.classList.remove('open');
                navHomeBtn.classList.remove('active');
            });
        });

        document.addEventListener('click', function () {
            navHomeSub.classList.remove('open');
            navHomeBtn.classList.remove('active');
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') {
                navHomeSub.classList.remove('open');
                navHomeBtn.classList.remove('active');
            }
        });
    }

    // ── Smooth scroll for anchor links ───────────────────────────────────
    document.querySelectorAll('nav a[href^="#"]').forEach(function (link) {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

});
