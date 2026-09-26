document.addEventListener('DOMContentLoaded', () => {

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

    if (navBrand && navBrand.getAttribute('href') === '#page-top') {
        navBrand.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

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

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightboxModal.classList.contains('active')) {
                lightboxModal.classList.remove('active');
                lightboxImg.src = '';
                document.body.style.overflow = '';
            }
        });
    }

    const isDesktopHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const verticalVideoFrames = document.querySelectorAll('.vertical-video-frame');

    if (isDesktopHover && verticalVideoFrames.length > 0) {
        verticalVideoFrames.forEach(frame => {
            const video = frame.querySelector('video');
            if (!video) return;

            frame.addEventListener('mouseenter', () => {
                video.muted = true;
                const playPromise = video.play();
                if (playPromise !== undefined) {
                    playPromise.catch(() => {});
                }
            });

            frame.addEventListener('mouseleave', () => {
                video.pause();
                video.currentTime = 0;
            });
        });
    }

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

    const gridBtn = document.getElementById('view-grid-btn');
    const filmBtn = document.getElementById('view-filmstrip-btn');
    const posterContainer = document.getElementById('poster-container');

    if (gridBtn && filmBtn && posterContainer) {
        gridBtn.addEventListener('click', () => {
            gridBtn.classList.add('active');
            filmBtn.classList.remove('active');
            posterContainer.classList.remove('filmstrip-mode');
        });

        filmBtn.addEventListener('click', () => {
            filmBtn.classList.add('active');
            gridBtn.classList.remove('active');
            posterContainer.classList.add('filmstrip-mode');
        });
    }

});
