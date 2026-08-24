# Native Coast Appliances — Project & Conversation Archive

**Date:** August 25, 2026  
**Conversation ID:** `4847329b-efeb-4a4a-9777-f6414bba1a24`  
**GitHub Repository:** [https://github.com/Muqeet04/native-coast-appliances](https://github.com/Muqeet04/native-coast-appliances)  
**Live Production URL:** [https://native-coast-appliances.vercel.app](https://native-coast-appliances.vercel.app)

---

## 1. Project Overview & Brand Identity

- **Company:** Native Coast Appliances (Bespoke Kitchen Renovations & Fittings)
- **Palette:**
  - Primary Reddish-Brown: `#7B3F2E`
  - Secondary Ochre: `#A0522D`
  - Accent Brass: `#C4884A`
  - Cream Background: `#FDF8F4` / `#F5EDE4`
  - Dark Charcoal: `#1A100C`
  - Deep Text: `#2E1A0F`
- **Typography:**
  - Headings / Display: *Playfair Display* (Editorial Serif)
  - Body / Subtitles: *Montserrat* (Geometric Clean Sans)

---

## 2. Implemented Features & Architecture

### Section 1: Hero Frame Scroll Canvas (`#top`)
- **Technology:** HTML5 `<canvas id="scrollCanvas" width="1920" height="1080">` + GSAP ScrollTrigger
- **Asset Sequence:** 192 extracted 1080p WebP video frames (`frames/frame_0001.webp` through `frames/frame_0192.webp`)
- **Functionality:**
  - Pinned viewport at `#top`.
  - Initial load shows the headline *"Where craft meets coast"*, subheading, and animated scroll indicator.
  - As user scrolls down, the headline floats up and fades, while the canvas scrubs progressively from frame 0 to 191 to assemble the kitchen installation in real time.
  - Synchronized narrative panels fade in and out during the scrub:
    1. *"Kitchens that outlast the trend"*
    2. *"Fitted by hand, finished in stone"*
    3. *"Colour-matched to your walls"*
    4. *"Done in five days. Yours for life."* + *"Start your kitchen →"* button.

### Section 2: CTA Banner ("Supper at eight")
- Rich reddish-brown background with editorial quote on quality joinery, bench-sprayed cabinetry, and laser-templated stone.

### Section 3: Interactive Picture Buffer / Cursor Trail (`#buffer`)
- **Reference:** Canva Road-Map Page 2 specification
- **Functionality:**
  - Interactive stage `#bufferStage` tracking mouse move and mobile touch move.
  - Dynamically spawns tilt-rotated, drop-shadowed kitchen image cards at pointer coordinates from a pool of 14 local high-res project images.
  - Auto DOM cleanup (caps active items and gracefully fades them out after ~2 seconds).
  - Centered callout: *"Move your cursor!"*, *"What are you in the mood for?"*, and pill buttons (*See the Work*, *Get a Quote*).

### Section 4: Craft & Services (`#craft`)
- 4 luxury service cards:
  1. *Bespoke cabinetry*
  2. *Stone worktops*
  3. *Brass, taps & lighting*
  4. *Full renovation & fit*
- Custom SVG line iconography and hover elevation.

### Section 5: 5-Day Process Timeline (`#process`)
- 4 numbered milestone badges (`01 Design`, `02 The workshop`, `03 The fit`, `04 Handover`) with vertical gradient connecting line.

### Section 6: Selected Portfolio / Horizontal Scroll (`#work`)
- **Technology:** GSAP ScrollTrigger horizontal pinned track
- **Functionality:**
  - Pinned 100vh dark container (`#1A100C`).
  - Progress bar at the top `#galleryProgressBar` scaling in real time (`scaleX(progress)`).
  - 8 project cards sliding horizontally on vertical scroll:
    - *01 The Surrey Estate*
    - *02 The Coastal Haven*
    - *03 The Knightsbridge*
    - *04 The Light Pavilion*
    - *05 The Highgate Residence*
    - *06 The Cotswolds Farmhouse*
    - *07 The Chelsea Penthouse*
    - *08 The Kensington Modern*

### Section 7: Contact & Quotation Form (`#contact`)
- Split layout: Direct phone (`01234 567 890`) and email (`hello@nativecoast.co.uk`) on left; quote form with name, email, phone, message fields on right.

### Section 8: Footer
- Brand badge, navigation links, and copyright notices.

---

## 3. Project File Tree

```
Site1/
├── index.html                   # Semantic markup with all sections & canvas
├── style.css                    # Responsive styles, typography & color variables
├── main.js                      # GSAP ScrollTrigger timelines, canvas scrub & cursor trail
├── frames/                      # 192 WebP 1080p animation frames
│   ├── frame_0001.webp
│   └── ... frame_0192.webp
├── peakpx.jpg                   # Local high-res project photography
├── peakpx (1).jpg - (13).jpg    # 13 additional high-res kitchen photos
├── .gitignore                   # Git ignores (.vercel, raw mp4, etc.)
└── PROJECT_DOCUMENTATION.md     # Full conversation & project summary archive
```

---

## 4. Git & Deployment Log

- **Git Repository:** `Muqeet04/native-coast-appliances`
- **Branch:** `main`
- **Deployments:** Deployed to Vercel production at [https://native-coast-appliances.vercel.app](https://native-coast-appliances.vercel.app).
