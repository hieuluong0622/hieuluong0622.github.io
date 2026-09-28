document.addEventListener('DOMContentLoaded', () => {

    const isDesktopHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    let audioEnabled = true;
    let audioCtx = null;

    const getAudioContext = () => {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        return audioCtx;
    };

    const playClickSound = () => {
        if (!isDesktopHover || !audioEnabled) return;
        try {
            const ctx = getAudioContext();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(820, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.035);
            gain.gain.setValueAtTime(0.08, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.035);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.035);
        } catch (e) {}
    };

    const playClapperSound = () => {
        if (!audioEnabled) return;
        try {
            const ctx = getAudioContext();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'square';
            osc.frequency.setValueAtTime(320, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.08);
            gain.gain.setValueAtTime(0.3, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.08);
        } catch (e) {}
    };

    const playRenderDing = () => {
        if (!audioEnabled) return;
        try {
            const ctx = getAudioContext();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(880, ctx.currentTime);
            gain.gain.setValueAtTime(0.2, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.6);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.6);
        } catch (e) {}
    };

    const trackEvent = (eventName, params = {}) => {
        if (typeof gtag === 'function') {
            gtag('event', eventName, params);
        }
    };

    const isIndexPage = window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/') || window.location.pathname === '';
    const hasSeenIntro = sessionStorage.getItem('clapper_intro_seen');

    if (isIndexPage && !hasSeenIntro) {
        const overlay = document.createElement('div');
        overlay.className = 'clapper-overlay';
        overlay.innerHTML = `
            <div class="clapper-slate">
                <div class="clapper-head-container">
                    <div class="clapper-arm" id="clapper-arm"></div>
                </div>
                <div class="clapper-body">
                    <div class="clapper-row">
                        <span class="clapper-label">PROD</span>
                        <span class="clapper-val">PORTFOLIO</span>
                    </div>
                    <div class="clapper-row">
                        <span class="clapper-label">SCENE</span>
                        <span class="clapper-val">01</span>
                        <span class="clapper-label">TAKE</span>
                        <span class="clapper-val">01</span>
                    </div>
                    <div class="clapper-row">
                        <span class="clapper-label">DIRECTOR</span>
                        <span class="clapper-val">HIEU LUONG</span>
                    </div>
                </div>
            </div>
            <div class="clapper-hint">Click anywhere to Action</div>
        `;
        document.body.appendChild(overlay);

        const dismissClapper = () => {
            const arm = document.getElementById('clapper-arm');
            if (arm) arm.classList.add('snapped');
            playClapperSound();
            sessionStorage.setItem('clapper_intro_seen', 'true');

            setTimeout(() => {
                overlay.classList.add('dismissed');
                setTimeout(() => {
                    overlay.remove();
                }, 500);
            }, 250);
        };

        overlay.addEventListener('click', dismissClapper, { once: true });
    }

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
                playClickSound();
                fullMenu.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        }

        if (closeMenuBtn) {
            closeMenuBtn.addEventListener('click', () => {
                playClickSound();
                closeMenu();
            });
        }

        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                playClickSound();
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
                playClickSound();
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
                playClickSound();
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
            playClickSound();
            lightboxImg.src = src;
            lightboxModal.classList.add('active');
            document.body.style.overflow = 'hidden';
            trackEvent('view_poster_lightbox', { poster_url: src });
        };

        window.closeLightbox = function(e) {
            if (e.target !== lightboxImg) {
                playClickSound();
                lightboxModal.classList.remove('active');
                lightboxImg.src = '';
                document.body.style.overflow = '';
            }
        };

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightboxModal.classList.contains('active')) {
                playClickSound();
                lightboxModal.classList.remove('active');
                lightboxImg.src = '';
                document.body.style.overflow = '';
            }
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
            playClickSound();
            gridBtn.classList.add('active');
            filmBtn.classList.remove('active');
            posterContainer.classList.remove('filmstrip-mode');
            trackEvent('switch_view_mode', { mode: 'grid' });
        });

        filmBtn.addEventListener('click', () => {
            playClickSound();
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
            playClickSound();
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

    const renderModal = document.createElement('div');
    renderModal.className = 'render-modal-backdrop';
    renderModal.innerHTML = `
        <div class="render-dialog">
            <div class="render-dialog-header">
                <span class="render-dialog-title"><i class="fas fa-film"></i> Media Queue Export</span>
                <span style="font-size: 0.65rem; color: #888; font-family: monospace;">Render Engine v2.6</span>
            </div>
            <div class="render-dialog-body">
                <div class="render-file-info">
                    <div class="render-file-icon"><i class="fas fa-file-pdf"></i></div>
                    <div>
                        <div class="render-file-name">CV_LuongTrungHieu.pdf</div>
                        <div class="render-file-meta">Preset: High Quality Profile &bull; 1.2 MB</div>
                    </div>
                </div>
                <div class="render-bar-container">
                    <div class="render-bar-fill" id="render-bar-fill"></div>
                </div>
                <div class="render-status-row">
                    <span class="render-status-text" id="render-status-text">Encoding...</span>
                    <span id="render-progress-num">0%</span>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(renderModal);

    const barFill = renderModal.querySelector('#render-bar-fill');
    const statusText = renderModal.querySelector('#render-status-text');
    const progressNum = renderModal.querySelector('#render-progress-num');

    const triggerRenderExport = (targetUrl) => {
        renderModal.classList.add('active');
        barFill.style.width = '0%';
        statusText.textContent = 'Encoding...';
        progressNum.textContent = '0%';

        let currentPercent = 0;
        const interval = setInterval(() => {
            currentPercent += Math.floor(Math.random() * 18) + 12;
            if (currentPercent >= 100) {
                currentPercent = 100;
                clearInterval(interval);
                barFill.style.width = '100%';
                progressNum.textContent = '100%';
                statusText.textContent = 'Render Finished!';
                playRenderDing();

                setTimeout(() => {
                    renderModal.classList.remove('active');
                    window.open(targetUrl, '_blank');
                }, 400);
            } else {
                barFill.style.width = `${currentPercent}%`;
                progressNum.textContent = `${currentPercent}%`;
            }
        }, 60);
    };

    document.querySelectorAll('a[href*="CV_LuongTrungHieu.pdf"]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            playClickSound();
            const targetUrl = btn.getAttribute('href');
            triggerRenderExport(targetUrl);
            trackEvent('click_download_resume', {
                link_text: btn.textContent.trim(),
                page: window.location.pathname
            });
        });
    });

    document.querySelectorAll('a[href*="linkedin.com"]').forEach(btn => {
        btn.addEventListener('click', () => {
            playClickSound();
            trackEvent('click_linkedin', {
                page: window.location.pathname
            });
        });
    });

    let bindCursorToDynamicElements = () => {};

    if (isDesktopHover) {
        const dot = document.createElement('div');
        dot.className = 'custom-cursor-dot';

        const ring = document.createElement('div');
        ring.className = 'custom-cursor-ring';

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
