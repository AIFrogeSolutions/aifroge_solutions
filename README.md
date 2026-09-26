# AI Forge Solution — Website

A static marketing site for AI Forge Solution: Home, About, Services, Team, Projects, and Contact.

## Stack

Plain HTML, CSS, and vanilla JavaScript. No build step, no backend, no database.

- `index.html`, `about.html`, `services.html`, `team.html`, `projects.html`, `contact.html`
- `css/style.css` — all styling
- `js/main.js` — nav toggle, scroll-reveal animations, and client-side rendering of the Services/Team/Projects cards from the JSON files below
- `data/services.json`, `data/team.json`, `data/projects.json` — content for the cards on those pages; edit these to update copy without touching HTML
- `images/logo.jpeg`

## Contact form

The contact form has no backend to post to. On submit, it opens the visitor's email client with a pre-filled message addressed to `aifrogesolution@gmail.com`, via a `mailto:` link built in `js/main.js`.

## Deploying

This is a plain static site — drop the repo root into any static host:

- **Vercel** — import the repo, no build command needed, output directory is the repo root
- **Netlify** — same, no build command, publish directory `.`
- **GitHub Pages** — enable Pages on this repo, serve from the root of `main`
- **Cloudflare Pages** — no build command, output directory `/`

## Content status

The Projects, Team, and Services pages currently show early/placeholder content in the JSON data files. These are being finalized separately, project by project, before anything is presented as a completed, shipped project.
