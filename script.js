gsap.registerPlugin(ScrollTrigger);

const initLenis = () => {
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smooth: true,
        smoothTouch: false,
    });

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
};

const initLoading = () => {
    const progress = document.querySelector('.loader-progress');
    const percentage = document.querySelector('.loader-percentage');
    const loader = document.querySelector('.loader');
    
    let loadProgress = 0;
    
    const interval = setInterval(() => {
        loadProgress += Math.random() * 15;
        if(loadProgress > 100) loadProgress = 100;
        
        progress.style.width = `${loadProgress}%`;
        percentage.textContent = `${Math.floor(loadProgress)}%`;
        
        if(loadProgress === 100) {
            clearInterval(interval);
            setTimeout(() => {
                gsap.to(loader, {
                    opacity: 0,
                    duration: 1,
                    onComplete: () => {
                        loader.style.display = 'none';
                        document.body.classList.remove('loading');
                        initHeroAnimations();
                    }
                });
            }, 500);
        }
    }, 150);
};

const initCustomCursor = () => {
    const cursor = document.querySelector('.custom-cursor');
    const dot = document.querySelector('.cursor-dot');
    const ring = document.querySelector('.cursor-ring');
    const text = document.querySelector('.cursor-text');
    
    if (window.innerWidth <= 1024 || !cursor) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    const render = () => {
        ringX += (mouseX - ringX) * 0.15;
        ringY += (mouseY - ringY) * 0.15;

        dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
        ring.style.transform = `translate(${ringX}px, ${ringY}px)`;
        text.style.transform = `translate(${ringX}px, ${ringY}px)`;

        requestAnimationFrame(render);
    };
    render();

    const hoverElements = document.querySelectorAll('[data-cursor="hover"]');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });

    const projectElements = document.querySelectorAll('[data-cursor="project"]');
    projectElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('project-hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('project-hover'));
    });
};

const initWheelAnimation = () => {
    const outer = document.getElementById('wheel-outer');
    const symbols = document.getElementById('wheel-symbols');
    const inner = document.getElementById('wheel-inner');
    
    gsap.to(outer, {
        rotation: 360,
        transformOrigin: "center center",
        duration: 60,
        repeat: -1,
        ease: "none"
    });

    const symbolsTl = gsap.timeline({ repeat: -1 });
    symbolsTl.to(symbols, { rotation: -180, duration: 20, ease: "power1.inOut" })
             .to(symbols, { rotation: -170, duration: 2, ease: "bounce.out" })
             .to(symbols, { rotation: -360, duration: 25, ease: "power2.inOut" });

    const innerTl = gsap.timeline({ repeat: -1 });
    innerTl.to(inner, { rotation: 360, duration: 15, ease: "power3.inOut" })
           .to(inner, { rotation: 350, duration: 1, ease: "power1.inOut" })
           .to(inner, { rotation: 720, duration: 20, ease: "none" });

    const light = document.querySelector('.hero-ambient-light');
    gsap.to(light, {
        opacity: 0.3,
        scale: 1.2,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });
};

const initGlitchEffect = () => {
    const glitches = document.querySelectorAll('.portrait-glitch');
    if (!glitches.length) return;

    const doGlitch = () => {
        const activeGlitch = glitches[Math.floor(Math.random() * glitches.length)];
        
        const type = Math.random();
        
        if (type < 0.5) {
            gsap.set(activeGlitch, {
                opacity: 0.7,
                x: Math.random() * 20 - 10,
                filter: `hue-rotate(${Math.random() * 90}deg) contrast(1.5)`,
                clipPath: `polygon(0 ${Math.random() * 40 + 40}%, 100% ${Math.random() * 40 + 40}%, 100% ${Math.random() * 20 + 80}%, 0 ${Math.random() * 20 + 80}%)`
            });
        } else {
            gsap.set(activeGlitch, {
                opacity: 0.5,
                x: Math.random() * -15,
                filter: `hue-rotate(-${Math.random() * 90}deg)`,
                clipPath: `polygon(0 ${Math.random() * 50 + 30}%, 100% ${Math.random() * 50 + 30}%, 100% ${Math.random() * 10 + 90}%, 0 ${Math.random() * 10 + 90}%)`
            });
        }

        setTimeout(() => {
            gsap.set(activeGlitch, { opacity: 0, x: 0 });
            setTimeout(doGlitch, Math.random() * 3000 + 500);
        }, Math.random() * 150 + 50);
    };

    setTimeout(doGlitch, 1500);
};

const initMouseParallax = () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.innerWidth <= 768) return;

    const hero = document.querySelector('.hero');
    const wheel = document.querySelector('.wheel-container');
    const portrait = document.querySelector('.portrait-wrapper');
    const bgText = document.querySelector('.hero-bg-text');

    hero.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5);
        const y = (e.clientY / window.innerHeight - 0.5);

        gsap.to(wheel, { x: x * 30, y: y * 30, duration: 1, ease: "power2.out" });
        gsap.to(portrait, { x: x * -10, y: y * -10, duration: 1, ease: "power2.out" });
        gsap.to(bgText, { x: x * 15, y: y * 15, duration: 1, ease: "power2.out" });
    });
};

const initParticles = () => {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const count = window.innerWidth < 768 ? 30 : 80;

    for (let i = 0; i < count; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 1.5,
            speedX: (Math.random() - 0.5) * 0.2,
            speedY: Math.random() * 0.3 - 0.5,
            color: Math.random() > 0.8 ? 'rgba(157, 78, 221, 0.5)' : 'rgba(255, 255, 255, 0.2)'
        });
    }

    const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(p => {
            p.x += p.speedX;
            p.y += p.speedY;

            if (p.y < 0) p.y = canvas.height;
            if (p.x < 0) p.x = canvas.width;
            if (p.x > canvas.width) p.x = 0;

            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        });

        requestAnimationFrame(animate);
    };

    animate();

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
};

const initScanline = () => {
    const scanline = document.querySelector('.scanline');
    gsap.to(scanline, {
        y: window.innerHeight,
        duration: 8,
        repeat: -1,
        ease: "none"
    });
};

const initNavbarScroll = () => {
    const nav = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });
};

const initHeroAnimations = () => {
    const tl = gsap.timeline();
    
    tl.fromTo('.hero-title-main', 
        { opacity: 0, scale: 0.9, y: 50 },
        { opacity: 1, scale: 1, y: 0, duration: 1.5, ease: "power3.out" }
    )
    .fromTo('.wheel-container',
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 2, ease: "power2.out" },
        "-=1"
    )
    .fromTo('.portrait-wrapper',
        { opacity: 0, y: 100 },
        { opacity: 1, y: 0, duration: 1.5, ease: "power3.out" },
        "-=1.5"
    )
    .fromTo(['.hero-quote', '.cta-button', '.signature', '.hero-desc', '.hero-coords', '.vertical-text'],
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1, stagger: 0.1, ease: "power2.out" },
        "-=1"
    );
};

const initScrollTriggers = () => {
    gsap.to('.hero-title-main', {
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 1
        },
        y: 150,
        opacity: 0
    });

    gsap.to('.portrait-wrapper', {
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 1
        },
        scale: 1.08,
        y: 50
    });

    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach((card, i) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 85%'
            },
            y: 50,
            opacity: 0,
            duration: 0.8,
            delay: i * 0.1,
            ease: "power2.out"
        });
    });

    const processItems = document.querySelectorAll('.process-item');
    processItems.forEach((item, i) => {
        gsap.from(item, {
            scrollTrigger: {
                trigger: item,
                start: 'top 90%'
            },
            x: -30,
            opacity: 0,
            duration: 0.6,
            ease: "power2.out"
        });
    });

    gsap.from('.footer-title-script', {
        scrollTrigger: {
            trigger: '.footer',
            start: 'top 80%'
        },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
    });
};

document.addEventListener("DOMContentLoaded", () => {
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        initLenis();
    }
    initLoading();
    initCustomCursor();
    initWheelAnimation();
    initGlitchEffect();
    initMouseParallax();
    initParticles();
    initScanline();
    initNavbarScroll();
    initScrollTriggers();
});
