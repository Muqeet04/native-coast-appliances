# Native Coast Appliances

A single-page marketing site for a bespoke kitchen fitting company, built around a scroll-driven video hero and an interactive image trail.

🔗 **Live demo:** [native-coast-appliances.vercel.app](https://native-coast-appliances.vercel.app)

## Features
- **Scroll-scrubbed hero:** a 192-frame WebP sequence drawn to `<canvas>` and synced to scroll with GSAP ScrollTrigger, with narrative panels fading in along the way
- **Cursor image trail:** kitchen photos spawn and fade at the pointer on mouse and touch
- **Portfolio grid** of past kitchen projects
- Fully responsive, no build step

## Tech Stack
HTML5 Canvas · CSS · Vanilla JavaScript · GSAP + ScrollTrigger · Vercel

## How to Run
```bash
git clone https://github.com/Muqeet04/native-coast-appliances.git
cd native-coast-appliances
npx serve .        # or open index.html with any static server
```

## Project Structure
```
index.html
style.css
main.js
frames/    # hero animation frames (frame_0001–0192.webp)
images/    # kitchen photos
```

See [PROJECT_DOCUMENTATION.md](PROJECT_DOCUMENTATION.md) for the full design notes (palette, typography, section-by-section breakdown).
