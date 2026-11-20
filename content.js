/*
  All portfolio content lives here.
  - Paths point at the web-ready copies in assets/web/ (made by `python build-assets.py`).
    Your originals stay untouched in the other assets/ folders.
  - Images and videos keep their own shape automatically; `ratio` just reserves the right space while they load.
  - Order in each list = order on the page.
*/
const W = "assets/web";

window.PORTFOLIO = {
  person: {
    name: "Tawanda Aldrin Guzha",
    short: "Tawanda Guzha",
    signature: "Aldrin",
    email: "tawandaaldg@gmail.com",
    instagram: { handle: "@______aldrin", url: "https://www.instagram.com/______aldrin" },
    status: "Open to full-time & freelance work",
  },

  // Graphic design: one Instagram-style carousel per brand / client
  brands: [
    {
      id: "art-factorie",
      name: "Art Factorie",
      kind: "Brand identity & merchandise",
      note: "Logo, tees, hoodies, business cards and a tote bag.",
      slides: [
        { src: `${W}/graphic-design/art-factorie/art-factory-page-0001.webp`, label: "Logo", ratio: "16/9" },
        { src: `${W}/graphic-design/art-factorie/art-factory-page-0003.webp`, label: "White tees", ratio: "16/9" },
        { src: `${W}/graphic-design/art-factorie/art-factory-page-0004.webp`, label: "Black tees", ratio: "16/9" },
        { src: `${W}/graphic-design/art-factorie/art-factory-page-0005.webp`, label: "Hoodies", ratio: "16/9" },
        { src: `${W}/graphic-design/art-factorie/art-factory-page-0006.webp`, label: "Business cards", ratio: "16/9" },
        { src: `${W}/graphic-design/art-factorie/art-factory-page-0007.webp`, label: "Tote bag", ratio: "16/9" },
      ],
    },
    {
      id: "alabaster",
      name: "Alabaster Beauty Spa",
      kind: "Instagram carousel",
      note: "“Booked a facial? Don't make these 5 mistakes”: a six-slide skincare carousel.",
      slides: ["Cover", "Mistake 1", "Mistake 2", "Mistake 3", "Mistake 4", "Mistake 5"].map((label, i) => ({
        src: `${W}/graphic-design/alabaster/${i + 1}.webp`, label, ratio: "4/5",
      })),
    },
    {
      id: "shiloh",
      name: "Shiloh Wellness Centre",
      kind: "Instagram carousel",
      note: "A five-slide awareness carousel for World COPD Day.",
      slides: ["World COPD Day", "What COPD is", "Symptoms", "Risk factors", "Get assessed"].map((label, i) => ({
        src: `${W}/graphic-design/shiloh/${i + 1}.webp`, label, ratio: "4/5",
      })),
    },
  ],

  // Videos play on the page. The first motion graphic is the big showreel.
  videos: {
    motion: [
      { title: "Art Factorie", src: `${W}/videos/motion-graphics/art-factory-motion-graphic.mp4`, poster: `${W}/videos/motion-graphics/art-factory-motion-graphic.webp`, ratio: "16/9" },
      { title: "Kwique Delivery", src: `${W}/videos/motion-graphics/kwique-delivery-v2.mp4`, poster: `${W}/videos/motion-graphics/kwique-delivery-v2.webp`, ratio: "9/16" },
      { title: "One Voice", src: `${W}/videos/motion-graphics/one-voice-27.mp4`, poster: `${W}/videos/motion-graphics/one-voice-27.webp`, ratio: "16/9" },
    ],
    editing: [
      { title: "Clone effect", src: `${W}/videos/editing/clone-effect.mp4`, poster: `${W}/videos/editing/clone-effect.webp`, ratio: "9/16" },
      { title: "Create", src: `${W}/videos/editing/create.mp4`, poster: `${W}/videos/editing/create.webp`, ratio: "9/16" },
      { title: "How", src: `${W}/videos/editing/how.mp4`, poster: `${W}/videos/editing/how.webp`, ratio: "9/16" },
      { title: "Theme song throwback", src: `${W}/videos/editing/who-remembers-this-theme-song-art-fyp-capcut.mp4`, poster: `${W}/videos/editing/who-remembers-this-theme-song-art-fyp-capcut.webp`, ratio: "9/16" },
    ],
    automation: [
      { title: "AI personal assistant in n8n", src: `${W}/videos/automation/n8n.mp4`, poster: `${W}/videos/automation/n8n.webp`, ratio: "16/9" },
      { title: "Jarvis voice assistant", src: `${W}/videos/automation/ee2a-6fd2-4d09-9a39-51587580a933.mp4`, poster: `${W}/videos/automation/ee2a-6fd2-4d09-9a39-51587580a933.webp`, ratio: "9/16" },
      { title: "Hand-tracking visuals", src: `${W}/videos/automation/2026-04-21-16-19-19-1.mp4`, poster: `${W}/videos/automation/2026-04-21-16-19-19-1.webp`, ratio: "16/9" },
      { title: "AI product placement", src: `${W}/videos/automation/20260601-185907124.mp4`, poster: `${W}/videos/automation/20260601-185907124.webp`, ratio: "9/16" },
    ],
  },

  art: {
    // Artworks have no titles on the page
    artworks: [
      { src: `${W}/fine-art/artworks/file-00000000a8d8820ba6b7174e15f6897f.webp`, ratio: "1086/1448" },
      { src: `${W}/fine-art/artworks/file-00000000eb4082088b34c998f7eb7d50.webp`, ratio: "1086/1448" },
      { src: `${W}/fine-art/artworks/img-20250529-wa0013.webp`, ratio: "2527/3965" },
      { src: `${W}/fine-art/artworks/20250211-204141-0000.webp`, ratio: "1/1" },
    ],
    // Only these get captions: the person's name (from the file name); `role` is optional
    dignitaries: [
      { src: `${W}/fine-art/dignitaries/dr-s-jaishankur.webp`, name: "Dr S. Jaishankar", role: null },
      { src: `${W}/fine-art/dignitaries/zozibini-tunzi.webp`, name: "Zozibini Tunzi", role: null },
      { src: `${W}/fine-art/dignitaries/gemma-griffiths.webp`, name: "Gemma Griffiths", role: null },
      { src: `${W}/fine-art/dignitaries/nusraat-faria.webp`, name: "Nusraat Faria", role: null },
    ],
  },

  journey: [
    {
      when: "2021 – 2025",
      title: "Bachelor's in Product Design",
      org: "Parul University",
      text: "Academic requirements completed.",
      badge: true,
    },
    {
      when: "Jul – Nov 2025",
      title: "Graphic Designer & Video Editor",
      org: "Vrundaz Technology",
      text: "Designed graphics and edited video content for the company's visual communication.",
    },
    {
      when: "Now",
      title: "Freelance Graphic Designer",
      org: "Shiloh Wellness Centre & Alabaster Beauty Spa",
      text: "Brand visuals and social media content for two South African businesses.",
    },
  ],

  // No quote: name, role and phone number only
  reference: {
    name: "Sameer Bakshi",
    role: "Professional Designer and Lecturer",
    phone: "+91 81400 04246",
  },

  // Logos are the official marks, stored in assets/logos
  tools: [
    { group: "Design", items: [
      { name: "Adobe Photoshop", logo: "assets/logos/photoshop.svg" },
      { name: "Adobe Illustrator", logo: "assets/logos/illustrator.svg" },
      { name: "Canva", logo: "assets/logos/canva.svg" },
    ] },
    { group: "Video & motion", items: [
      { name: "Adobe Premiere Pro", logo: "assets/logos/premiere-pro.svg" },
      { name: "CapCut", logo: "assets/logos/capcut.svg" },
    ] },
    { group: "AI & automation", items: [
      { name: "n8n", logo: "assets/logos/n8n.svg" },
      { name: "ChatGPT", logo: "assets/logos/chatgpt.svg" },
      { name: "Claude", logo: "assets/logos/claude.svg" },
      { name: "Gemini", logo: "assets/logos/gemini.svg" },
    ] },
  ],
};
