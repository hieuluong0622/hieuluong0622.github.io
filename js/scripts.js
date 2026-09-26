/**
 * Core Interactive Scripts - Hieu Luong Portfolio
 * Handles Navigation Menu, Smooth Scrolling, Hero Opacity, Image Lightbox & Smart Video Player
 */

document.addEventListener('DOMContentLoaded', () => {

    /* --- 1. FULLSCREEN MENU NAVIGATION --- */
    const openMenuBtn = document.getElementById('open-menu-btn');
    const closeMenuBtn = document.getElementById('close-menu-btn');
    const fullMenu = document.getElementById('fullscreen-menu');
    const navLinks = document.querySelectorAll('.nav-link-item');
    const navBrand = document.querySelector('.nav-brand-center');

    const closeMenu = () => {
        if (fullMenu) {
            fullMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    };

    if (openMenuBtn && fullMenu) {
        openMenuBtn.addEventListener('click', () => {
            fullMenu.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    if (closeMenuBtn) {
        closeMenuBtn.addEventListener('click', closeMenu);
    }

    // Tự động đóng menu khi bấm vào link và cuộn trang mượt
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            closeMenu();
            const targetHref = link.getAttribute('href');
            if (targetHref === '#page-top') {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    });

    // Cuộn lên đầu trang khi bấm vào tên Brand trên Navbar
    if (navBrand && navBrand.getAttribute('href') === '#page-top') {
        navBrand.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* --- 2. HERO PARALLAX OPACITY (CHỈ DÀNH CHO INDEX.HTML) --- */
    const heroContent = document.getElementById('hero-content');
    const mastheadDark = document.querySelector('.masthead-dark');

    if (heroContent && mastheadDark) {
        window.addEventListener('scroll', () => {
            const scrollY = window.pageYOffset || document.documentElement.scrollTop;
            let opacity = 1 - (scrollY / 350);
            if (opacity < 0) opacity = 0;
            if (opacity > 1) opacity = 1;
            
            heroContent.style.opacity = opacity;
            mastheadDark.style.pointerEvents = (opacity === 0) ? 'none' : 'auto';
        }, { passive: true });
    }

    /* --- 3. LIGHTBOX IMAGE POPUP (CHỈ DÀNH CHO XGEAR.HTML) --- */
    const lightboxModal = document.getElementById('lightbox-modal');
    const lightboxImg = document.getElementById('lightbox-img');

    if (lightboxModal && lightboxImg) {
        window.openLightbox = function(src) {
            lightboxImg.src = src;
            lightboxModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        };

        window.closeLightbox = function(e) {
            if (e.target !== lightboxImg) {
                lightboxModal.classList.remove('active');
                lightboxImg.src = '';
                document.body.style.overflow = '';
            }
        };
    }

    /* --- 4. SMART VIDEO CONTROLLER (CHỈ DÀNH CHO CÁC TRANG CÓ VIDEO THẺ THUẦN) --- */
    const allVideos = document.querySelectorAll('video');
    if (allVideos.length > 0) {
        allVideos.forEach(video => {
            video.addEventListener('play', () => {
                allVideos.forEach(otherVideo => {
                    if (otherVideo !== video && !otherVideo.paused) {
                        otherVideo.pause();
                    }
                });
            });
        });
    }

});
