// =========================================================
// Admatiks Studios — main.js
// Smooth scroll (Lenis), GSAP animations, menu + back-to-top
// =========================================================

// Setup preferences
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Initialize Lenis for Smooth Scroll
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// GSAP Initialization
gsap.registerPlugin(ScrollTrigger);

// Keep ScrollTrigger in sync with Lenis' smooth scroll
lenis.on('scroll', ScrollTrigger.update);

// Hero intro timeline, played once the preloader lifts
let heroTl = null;

if (!reduceMotion) {
    // Header Hide/Show on Scroll
    let lastScrollY = window.scrollY;
    const header = document.getElementById('header');

    lenis.on('scroll', (e) => {
        if (e.scrollY > 100 && e.scrollY > lastScrollY) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        lastScrollY = e.scrollY;
    });

    // Hero Animation Load (held until the preloader lifts)
    heroTl = gsap.timeline({ paused: true });
    heroTl.to('.title-word', {
        y: 0,
        duration: 1,
        stagger: 0.18,
        ease: "power4.out"
    });
    heroTl.to('.hero-sub', {
        opacity: 1,
        duration: 0.8,
        ease: "power2.out"
    }, "-=0.3");

    // Hero Parallax (Blurred Text)
    gsap.to('#hero-glow', {
        yPercent: 40,
        ease: 'none',
        scrollTrigger: {
            trigger: '#hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true
        }
    });

    // Reveal Up Elements
    gsap.utils.toArray('.reveal-up').forEach(el => {
        gsap.to(el, {
            y: 0,
            opacity: 1,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
                trigger: el,
                start: "top 80%",
            }
        });
    });

    // Brand statement — pinned; one line revealed per scroll step, final line bounces in
    const studioSection = document.querySelector('#studio');
    const scrollCue = document.querySelector('#scroll-cue');
    if (studioSection) {
        const sLines = gsap.utils.toArray('#studio .statement-line'); // RIGHT MESSAGE/PEOPLE/PLACE/TIME
        const sNotes = gsap.utils.toArray('#studio .statement-note'); // handwritten annotations
        const sFinal = document.querySelector('#studio .statement-final');
        const noteForLine = { 0: sNotes[0], 1: sNotes[1], 3: sNotes[2] }; // RIGHT PLACE has none

        gsap.set(sLines, { opacity: 0, y: 40 });
        gsap.set(sNotes, { opacity: 0 }); // opacity-only keeps each note's rotation/offset
        gsap.set(sFinal, { opacity: 0, y: 60, scale: 0.6, transformOrigin: '50% 50%' });

        const studioTl = gsap.timeline({
            defaults: { ease: 'power3.out' },
            scrollTrigger: {
                trigger: '#studio',
                start: 'top top',
                end: () => '+=' + (window.innerHeight * 1.9),
                scrub: 0.4,
                pin: true,
                anticipatePin: 1,
                invalidateOnRefresh: true,
                onLeave: () => scrollCue && gsap.to(scrollCue, { autoAlpha: 0, duration: 0.4 }),
                onEnterBack: () => scrollCue && gsap.to(scrollCue, { autoAlpha: 1, duration: 0.4 }),
            }
        });

        sLines.forEach((line, i) => {
            studioTl.to(line, { opacity: 1, y: 0, duration: 0.6 });
            if (noteForLine[i]) studioTl.to(noteForLine[i], { opacity: 1, duration: 0.4 }, '<0.15');
            studioTl.to({}, { duration: 0.3 }); // brief hold before next step
        });

        // Final line drops in with a bounce, then settles before the section unpins
        studioTl.to(sFinal, { opacity: 1, y: 0, scale: 1, duration: 0.9, ease: 'back.out(2.2)' });
        studioTl.to({}, { duration: 0.35 });
    }

    // Second statement lines — progressive reveal
    gsap.utils.toArray('.reveal-line').forEach(el => {
        gsap.from(el, {
            opacity: 0,
            y: 40,
            duration: 1.1,
            ease: "power2.out",
            scrollTrigger: {
                trigger: el,
                start: "top 85%",
            }
        });
    });
} else {
    // Reduced motion: show elements without animating
    gsap.set(['.title-word'], { y: 0 });
    gsap.set(['.hero-sub', '.reveal-up', '.statement-line', '.statement-final', '.reveal-line'], { opacity: 1, y: 0 });
    gsap.set('.statement-note', { opacity: 1 });
}

// Hamburger Menu Logic
const menuBtn = document.getElementById('menu-btn');
const menuOverlay = document.getElementById('menu-overlay');
const menuItems = document.querySelectorAll('.menu-item');
const line1 = document.getElementById('hamburger-line-1');
const line2 = document.getElementById('hamburger-line-2');
const line3 = document.getElementById('hamburger-line-3');
let isMenuOpen = false;

function setHamburger(open) {
    line1.classList.toggle('translate-y-[6px]', open);
    line1.classList.toggle('rotate-45', open);
    line2.classList.toggle('opacity-0', open);
    line3.classList.toggle('-translate-y-[6px]', open);
    line3.classList.toggle('-rotate-[45deg]', open);
}

function openMenu() {
    isMenuOpen = true;
    setHamburger(true);
    menuOverlay.classList.remove('opacity-0', 'pointer-events-none');
    menuOverlay.classList.add('opacity-100', 'pointer-events-auto');
    lenis.stop(); // Stop scrolling

    gsap.to(menuItems, {
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: "power3.out",
        delay: 0.2
    });
}

function closeMenu() {
    isMenuOpen = false;
    setHamburger(false);
    menuOverlay.classList.remove('opacity-100', 'pointer-events-auto');
    menuOverlay.classList.add('opacity-0', 'pointer-events-none');
    lenis.start(); // Resume scrolling

    gsap.to(menuItems, {
        y: 32,
        opacity: 0,
        duration: 0.3,
        ease: "power2.in"
    });
}

menuBtn.addEventListener('click', () => {
    isMenuOpen ? closeMenu() : openMenu();
});

// Smooth-scroll in-page anchor links via Lenis; close the menu first
document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href');
        if (!targetId || targetId === '#') {
            e.preventDefault();
            return;
        }
        const target = document.querySelector(targetId);
        if (!target) return;

        e.preventDefault();
        if (isMenuOpen) closeMenu();

        lenis.scrollTo(target, {
            offset: 0,
            duration: 1.4,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        });
    });
});

// Back to top
document.getElementById('back-to-top').addEventListener('click', () => {
    lenis.scrollTo(0, { duration: 1.5, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
});

// Current year in footer
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Footer email capture (demo handler)
const emailForm = document.getElementById('email-form');
const emailStatus = document.getElementById('email-status');
emailForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!emailForm.checkValidity()) {
        emailStatus.textContent = 'Please enter a valid email.';
        emailStatus.className = 'mt-2 text-xs text-[#ff0a2f] min-h-[1rem]';
        emailForm.elements.email.reportValidity();
        return;
    }
    emailStatus.textContent = "You're on the list — we'll be in touch.";
    emailStatus.className = 'mt-2 text-xs text-[#e2e1d3]/80 min-h-[1rem]';
    emailForm.reset();
});

// What We Do — mobile image spotlight (touch has no hover): highlight the service nearest screen centre
const capItems = Array.from(document.querySelectorAll('#capabilities ul > li'));
if (capItems.length) {
    let scheduled = false;
    const spotlight = () => {
        scheduled = false;
        if (window.innerWidth >= 768) {
            capItems.forEach((item) => item.classList.remove('is-active'));
            return;
        }
        const center = window.innerHeight / 2;
        let best = null, bestDist = Infinity;
        for (const item of capItems) {
            const r = item.getBoundingClientRect();
            if (r.bottom < 0 || r.top > window.innerHeight) continue;
            const dist = Math.abs((r.top + r.bottom) / 2 - center);
            if (dist < bestDist) { bestDist = dist; best = item; }
        }
        capItems.forEach((item) => item.classList.toggle('is-active', item === best));
    };
    const requestSpotlight = () => {
        if (scheduled) return;
        scheduled = true;
        requestAnimationFrame(spotlight);
    };
    lenis.on('scroll', requestSpotlight);
    window.addEventListener('resize', requestSpotlight);
    spotlight();
}

// Header turns solid dark over the light sections so it stays legible
(function () {
    const header = document.getElementById('header');
    if (!header) return;
    const lightSections = ['#capabilities', '#clients'].map((s) => document.querySelector(s)).filter(Boolean);
    let scheduled = false;
    const update = () => {
        scheduled = false;
        const overLight = lightSections.some((sec) => {
            const r = sec.getBoundingClientRect();
            return r.top <= 96 && r.bottom >= 0;
        });
        header.classList.toggle('header--solid', overLight);
    };
    const req = () => { if (scheduled) return; scheduled = true; requestAnimationFrame(update); };
    lenis.on('scroll', req);
    window.addEventListener('resize', req);
    update();
})();

// Preloader — hold the curtain until fonts are ready, then reveal and play the hero
(function () {
    const preloader = document.getElementById('preloader');
    const play = () => { if (heroTl) heroTl.play(); else gsap.set('.title-word', { y: 0 }); };
    if (!preloader) { play(); return; }

    lenis.stop(); // lock scrolling while the loader is up
    let revealed = false;
    const reveal = () => {
        if (revealed) return;
        revealed = true;
        preloader.classList.add('is-hidden');
        lenis.start();
        play();
    };

    const started = performance.now();
    const MIN_SHOW = 600; // avoid a jarring flash
    const finish = () => setTimeout(reveal, Math.max(0, MIN_SHOW - (performance.now() - started)));
    const fontsReady = (document.fonts && document.fonts.ready) ? document.fonts.ready : Promise.resolve();
    fontsReady.then(finish).catch(finish);
    setTimeout(reveal, 4000); // safety net so the loader never sticks
})();
