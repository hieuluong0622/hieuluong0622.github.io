document.addEventListener('DOMContentLoaded', () => {

    const trackEvent = (eventName, params = {}) => {
        if (typeof gtag === 'function') {
            gtag('event', eventName, params);
        }
    };

    const initMenu = () => {
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
                if (targetHref === '#page-top' || targetHref === 'index.html#page-top') {
                    if (window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/')) {
                        e.preventDefault();
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                }
            });
        });

        if (navBrand) {
            navBrand.addEventListener('click', (e) => {
                if (window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/')) {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            });
        }

        const menuCopyEmailBtn = document.getElementById('menu-copy-email-btn');
        let menuCopyTimeout;

        if (menuCopyEmailBtn) {
            const tooltip = menuCopyEmailBtn.querySelector('.copy-tooltip');
            menuCopyEmailBtn.addEventListener('click', () => {
                const email = 'trunghieu220600@gmail.com';
                copyToClipboard(email).then(() => {
                    clearTimeout(menuCopyTimeout);
                    if (tooltip) tooltip.classList.add('show');

                    trackEvent('click_copy_email', { location: 'fullscreen_menu' });

                    menuCopyTimeout = setTimeout(() => {
                        if (tooltip) tooltip.classList.remove('show');
                    }, 2000);
                });
            });
        }
    };

    const navPlaceholder = document.getElementById('nav-placeholder');
    if (navPlaceholder) {
        fetch('components/nav.html')
            .then(res => res.text())
            .then(html => {
                navPlaceholder.innerHTML = html;
                initMenu();
                bindCursorToDynamicElements();
            })
            .catch(() => {
                initMenu();
            });
    } else {
        initMenu();
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
            trackEvent('view_poster_lightbox', { poster_url: src });
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
            trackEvent('switch_view_mode', { mode: 'grid' });
        });

        filmBtn.addEventListener('click', () => {
            filmBtn.classList.add('active');
            gridBtn.classList.remove('active');
            posterContainer.classList.add('filmstrip-mode');
            trackEvent('switch_view_mode', { mode: 'filmstrip' });
        });
    }

    const copyToClipboard = (text) => {
        if (navigator.clipboard && window.isSecureContext) {
            return navigator.clipboard.writeText(text);
        } else {
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            textArea.style.top = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            return new Promise((resolve, reject) => {
                document.execCommand('copy') ? resolve() : reject();
                textArea.remove();
            });
        }
    };

    const copyEmailBtn = document.getElementById('copy-email-btn');
    const copyEmailText = document.getElementById('copy-email-text');
    let copyTimeout;

    if (copyEmailBtn && copyEmailText) {
        copyEmailBtn.addEventListener('click', () => {
            const email = copyEmailBtn.getAttribute('data-email') || 'trunghieu220600@gmail.com';
            copyToClipboard(email).then(() => {
                clearTimeout(copyTimeout);
                copyEmailText.textContent = 'Copied to Clipboard!';
                copyEmailBtn.classList.add('copied');
                copyEmailBtn.querySelector('i').className = 'fas fa-check me-2';

                trackEvent('click_copy_email', { location: 'contact_section' });

                copyTimeout = setTimeout(() => {
                    copyEmailText.textContent = email;
                    copyEmailBtn.classList.remove('copied');
                    copyEmailBtn.querySelector('i').className = 'fas fa-envelope me-2';
                }, 2000);
            });
        });
    }

    document.querySelectorAll('a[href*="CV_LuongTrungHieu.pdf"]').forEach(btn => {
        btn.addEventListener('click', () => {
            trackEvent('click_download_resume', {
                link_text: btn.textContent.trim(),
                page: window.location.pathname
            });
        });
    });

    document.querySelectorAll('a[href*="linkedin.com"]').forEach(btn => {
        btn.addEventListener('click', () => {
            trackEvent('click_linkedin', {
                page: window.location.pathname
            });
        });
    });

    // ==========================================================
    // Custom Interactive Cursor Engine (Desktop Only)
    // ==========================================================
    let bindCursorToDynamicElements = () => {};

    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        const dot = document.createElement('div');
        dot.className = 'custom-cursor-dot';

        const ring = document.createElement('div');
        ring.className = 'custom-cursor-ring';

        const ringText = document.createElement('span');
        ringText.className = 'custom-cursor-text';
        ring.appendChild(ringText);

        document.body.appendChild(dot);
        document.body.appendChild(ring);

        let mouseX = -100, mouseY = -100;
        let ringX = -100, ringY = -100;
        let isCursorVisible = false;

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            if (!isCursorVisible) {
                dot.style.opacity = '1';
                ring.style.opacity = '1';
                isCursorVisible = true;
            }

            dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
        }, { passive: true });

        document.addEventListener('mouseleave', () => {
            dot.style.opacity = '0';
            ring.style.opacity = '0';
            isCursorVisible = false;
        });

        const renderCursor = () => {
            ringX += (mouseX - ringX) * 0.18;
            ringY += (mouseY - ringY) * 0.18;
            ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
            requestAnimationFrame(renderCursor);
        };
        requestAnimationFrame(renderCursor);

        const attachHoverEffects = (container = document) => {
            const viewCards = container.querySelectorAll('.project-card, .poster-card');
            viewCards.forEach(el => {
                el.addEventListener('mouseenter', () => {
                    ring.classList.add('cursor-hover-view');
                    dot.classList.add('cursor-hover-view');
                    ringText.textContent = 'VIEW';
                });
                el.addEventListener('mouseleave', () => {
                    ring.classList.remove('cursor-hover-view');
                    dot.classList.remove('cursor-hover-view');
                });
            });

            const videoCards = container.querySelectorAll('.vertical-video-frame, .cinematic-video-frame');
            videoCards.forEach(el => {
                el.addEventListener('mouseenter', () => {
                    ring.classList.add('cursor-hover-view');
                    dot.classList.add('cursor-hover-view');
                    ringText.textContent = 'PLAY';
                });
                el.addEventListener('mouseleave', () => {
                    ring.classList.remove('cursor-hover-view');
                    dot.classList.remove('cursor-hover-view');
                });
            });

            const interactiveBtns = container.querySelectorAll('.btn-minimal, .btn-view-more, .nav-brand-center, .nav-menu-btn, .menu-close-btn, .menu-copy-email-btn, .view-btn, .scroll-indicator, .brand-tiktok-pill, .menu-nav-links a, .menu-social-icons a');
            interactiveBtns.forEach(el => {
                el.addEventListener('mouseenter', () => {
                    ring.classList.add('cursor-hover-btn');
                    dot.classList.add('cursor-hover-btn');
                });
                el.addEventListener('mouseleave', () => {
                    ring.classList.remove('cursor-hover-btn');
                    dot.classList.remove('cursor-hover-btn');
                });
            });
        };

        attachHoverEffects();
        bindCursorToDynamicElements = () => {
            const navPlaceholderEl = document.getElementById('nav-placeholder');
            if (navPlaceholderEl) {
                attachHoverEffects(navPlaceholderEl);
            }
        };
    }

});
