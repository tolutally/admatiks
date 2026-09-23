# Admatiks Studios

A bold, culture-driven creative-studio landing page with big Anton typography, smooth scrolling, and GSAP scroll animations.

## Tech

- **Tailwind CSS** (Play CDN) for utility-first styling
- **GSAP + ScrollTrigger** for hero, parallax, and reveal animations
- **Lenis** for smooth scrolling
- **Iconify** for icons
- Google Fonts: Anton, Inter, Caveat

## Features

- Fullscreen animated menu overlay with hamburger toggle
- Auto-hiding header on scroll
- Animated hero headline + blurred parallax backdrop
- Selected-works grid with hover reveals
- Interactive services list with hover previews
- Smooth "back to top" and reduced-motion support

## Project structure

```
admatiks/
├── index.html          # Page markup + CDN includes (Tailwind, GSAP, Lenis, Iconify)
├── css/
│   └── styles.css      # Lenis smooth-scroll resets
├── js/
│   └── main.js         # Lenis + GSAP animations, menu, back-to-top
├── assets/
│   └── favicon.svg      # Site icon
└── README.md
```

## Run it locally

It's a static site, so just open `index.html` in your browser — or serve it for a nicer dev experience:

**VS Code:** install the *Live Server* extension, then right-click `index.html` → **Open with Live Server**.

**Python:**

```bash
python3 -m http.server 8000
```

Then visit http://localhost:8000

**Node:**

```bash
npx serve .
```

## Customize

- Swap the copy, project images, and links directly in [index.html](index.html).
- Tune the animations (durations, easing, triggers) in [js/main.js](js/main.js).
- For production, replace the Tailwind Play CDN with a compiled Tailwind build.

> Note: The portfolio images are loaded from an external demo asset host. Replace those URLs with your own assets before going live.
