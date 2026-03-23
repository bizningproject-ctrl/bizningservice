# Handly — Find Trusted Home Pros

A static front-end prototype for a home services marketplace that connects homeowners with verified local professionals.

## Overview

Handly allows homeowners to browse, filter, and book trusted professionals for household tasks — plumbing, electrical work, cleaning, painting, HVAC, and general handyman services. Pricing is transparent, reviews are real, and satisfaction is guaranteed.

## Pages

### `index.html` — Landing Page

The main marketing page with the following sections:

- **Hero** — Search bar, quick-select service tags, and sample pro profile cards
- **Services** — Six service categories with available pro counts
- **How It Works** — Three-step booking process (Describe → Get Matched → Book & Relax)
- **Featured Professionals** — Four top-rated pros across different categories
- **Testimonials** — Three customer reviews
- **CTA** — Calls to action for homeowners and new professionals
- **Footer** — Links to services, company info, and support

### `service.html` — Professionals Listing Page

A dynamic listing page driven by a URL query parameter (`?type=<service>`). Displays all professionals for the selected category with:

- **Filter buttons** — All / Top Rated / Verified Only / Available Now
- **Sort dropdown** — By Rating, Price (low/high), Most Jobs
- **Pro cards** — Avatar, name, verified badge, specialty, skill tags, rating, job count, hourly rate, and Book Now button

## Supported Service Types

| URL Parameter | Category      | Pros Available |
|---------------|---------------|----------------|
| `plumbing`    | Plumbing      | 8 pros         |
| `electrical`  | Electrical    | 6 pros         |
| `cleaning`    | Home Cleaning | 6 pros         |
| `painting`    | Painting      | 5 pros         |
| `hvac`        | HVAC          | 5 pros         |
| `handyman`    | Handyman      | 6 pros         |

Example: `service.html?type=electrical`

## Tech Stack

- Pure HTML, CSS, and vanilla JavaScript — no frameworks or build tools required
- Google Fonts: **Fraunces** (display) + **Outfit** (body)
- CSS custom properties for design tokens (colors, fonts, easing)
- IntersectionObserver for scroll-reveal animations

## Running Locally

Open `index.html` in any modern browser — no server required.

```bash
open index.html
# or
python3 -m http.server 8080
```

## Design

- **Color palette:** Navy `#1B2E4A`, Blue `#3B82F6`, Ice `#F0F4F8`, Charcoal `#0F172A`
- **Fully responsive** — adapts at 1024px and 768px breakpoints
- Subtle noise texture overlay, glassmorphism navbar, animated logo dot
