# Fixit — Find Trusted Home Pros

A home services marketplace built with **Vite** and vanilla JavaScript.

## Project Structure

```
├── index.html              # Entry point (home page)
├── service.html            # Entry point (service listing page)
├── vite.config.js
├── package.json
└── src/
    ├── main.js             # App entry — bootstraps router
    ├── style.css           # Global CSS (variables, resets, animations)
    ├── router.js           # Client-side SPA router
    ├── data/
    │   └── services.js     # All service categories, pros, testimonials data
    ├── components/
    │   ├── navbar.js       # Navbar component (home & service variants)
    │   ├── navbar.css
    │   ├── footer.js       # Footer component
    │   └── footer.css
    └── pages/
        ├── home.js         # Landing page (Hero, Services, Steps, Pros, Testimonials, CTA)
        ├── home.css
        ├── service.js      # Professionals listing page (filters, sort, cards)
        └── service.css
```

## Pages

### `/` — Landing Page
- Hero with animated pro profile cards and search
- 6 service categories
- "How It Works" 3-step process (dark section)
- 4 featured professionals
- Customer testimonials
- CTA section + Footer

### `/service?type=<category>` — Professionals Listing
Filter and sort verified professionals by service type.

| `type` param  | Category      | Pros |
|---------------|---------------|------|
| `plumbing`    | Plumbing      | 8    |
| `electrical`  | Electrical    | 6    |
| `cleaning`    | Home Cleaning | 6    |
| `painting`    | Painting      | 5    |
| `hvac`        | HVAC          | 5    |
| `handyman`    | Handyman      | 6    |

Filters: All / Top Rated / Verified Only / Available Now
Sort: Rating, Price (low/high), Most Jobs

## Tech Stack

- **Vite 6** — build tool, dev server, HMR
- **Vanilla JS (ES modules)** — no frameworks
- **CSS modules per component** — imported directly in JS
- **Client-side router** — `history.pushState` based SPA
- Google Fonts: Fraunces + Outfit

## Getting Started

```bash
npm install
npm run dev      # dev server at http://localhost:5173
npm run build    # production build → dist/
npm run preview  # preview production build
```
