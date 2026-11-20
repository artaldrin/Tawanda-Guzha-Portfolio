# Portfolio rebuild plan — Tawanda Aldrin Guzha

Status: **built and finalised** with all real images, videos, reference and email (2026-11-20).

## Look and feel
Based on the motionsites.ai "Dark Portfolio" template: midnight background, elegant serif headings, a cut-out portrait in the hero with work turning in a 3D ring behind it, a slim status bar on top, and a handwritten signature.

- Palette (kept from the original site): espresso `#211B18`, mocha `#49372E`, olive `#414A3B`, sage `#78816A`, stone `#B7B29C`, champagne `#D2B99A`, warm cream `#F2E9DD`
- Type: Bodoni Moda (headings), Hanken Grotesk (body), Mrs Saint Delafield (signature)
- Status: **placeholder preview built** (index.html, styles.css, script.js, content.js). All content and file paths live in `content.js`.
- Hero approach: **Orbit (chosen).** The cut-out portrait sits in the centre. Behind it, a curved 3D ring of your own work panels turns slowly: brand designs, art, and video frames. Visitors can drag to spin the ring, and clicking a panel opens that piece.
- Plain HTML, CSS and JavaScript; hosts free on GitHub Pages

## Sections
1. **Hero:** portrait, name, what you do, status line, short quote with signature
2. **About:** a *short* bio. No mention of India. Call him a "designer", not a "product design graduate".
3. **Graphic design:** each brand or client is one swipeable carousel, Instagram-style: arrows, swipe or drag, dots, and a counter like "3 / 8"
   - Art Factorie brand designs: one carousel
   - Alabaster Beauty Spa: one carousel
   - Shiloh Wellness Center: one carousel
4. **Video:** every video plays on the page in a built-in player. No Google Drive links.
   - Video editing (4)
   - Motion graphics (3, new)
   - Automation workflows (5): kept unless you say otherwise
5. **Fine art:** artworks, plus photos of portrait presentations with dignitaries. Each caption uses the person's name taken from the file name.
6. **Experience & education:** a timeline
   - Bachelor's in Product Design, Parul University, 2021–2025, with "academic requirements completed"
   - Vrundaz Technology: Graphic Designer & Video Editor, July–November 2025
   - Freelance graphic designer: Shiloh Wellness Center and Alabaster Beauty Spa, present
7. **Reference:** one reference (name, role, organisation, quote)
8. **Tools:** grouped by discipline
9. **Contact:** a redesigned section using your **new email** (to be supplied), plus Instagram

## Removed
- The AI image generation section and its images
- The long bio and the India paragraph
- All "award pending" wording

## Where your files go
Name each file by what it is; captions and order come from the file names.
Start a name with a number (`01 `, `02 `) to fix its position in a carousel.

```
assets/
  portrait/            your portrait (background will be removed)
  fine-art/
    artworks/          your drawings and paintings, named by title
    dignitaries/       photos named by the person, e.g. "Dr Jane Moyo.jpg"
  graphic-design/
    art-factorie/      all Art Factorie designs → one carousel
    clothing/<brand>/  one folder per clothing brand → one carousel each
    alabaster/         Alabaster Beauty Spa carousel
    shiloh/            Shiloh Wellness Center carousel
  videos/
    editing/           4 edited videos (.mp4)
    motion-graphics/   3 motion graphics videos (.mp4)
    automation/        workflow demos (.mp4)
```

Videos: upload the MP4 files themselves. I'll compress them for the web, keeping each under about 25 MB, and make a poster frame for each.

## Still needed from you
- [x] Hero approach: Orbit
- [x] Portrait photo
- [x] All images and videos added; web copies made with `python build-assets.py` (output in `assets/web/`)
- [x] Email: tawandaaldg@gmail.com
- [x] Reference: Sameer Bakshi, Professional Designer and Lecturer, +91 81400 04246
- [x] Location removed; top bar shows only "Open to full-time & freelance work"
- [x] Dignitaries captioned by name only (roles can be added in `content.js`)
