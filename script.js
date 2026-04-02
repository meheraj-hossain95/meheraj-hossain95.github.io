document.addEventListener('DOMContentLoaded', function () {

    // Mobile nav menu toggle
    const navMobileBtn = document.getElementById('navMobileBtn');
    const navMobileMenu = document.getElementById('navMobileMenu');

    if (navMobileBtn && navMobileMenu) {
        navMobileBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            navMobileMenu.classList.toggle('open');
        });

        navMobileMenu.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                navMobileMenu.classList.remove('open');
            });
        });

        document.addEventListener('click', function () {
            navMobileMenu.classList.remove('open');
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') {
                navMobileMenu.classList.remove('open');
            }
        });
    }

    // Set dynamic last modified date
    const lastModifiedElement = document.getElementById('last-modified-date');
    if (lastModifiedElement) {
        const lastModified = new Date(document.lastModified);
        const year = lastModified.getFullYear();
        const month = String(lastModified.getMonth() + 1).padStart(2, '0');
        const day = String(lastModified.getDate()).padStart(2, '0');
        const hours = String(lastModified.getHours()).padStart(2, '0');
        const minutes = String(lastModified.getMinutes()).padStart(2, '0');
        const formattedDate = `${year}/${month}/${day} ${hours}:${minutes}`;
        lastModifiedElement.querySelector('span').textContent = formattedDate;
    }

});