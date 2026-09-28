# Yogesh Ahlawat — 3D Portfolio

An interactive portfolio built with React 19, Three.js (React Three Fiber), Framer Motion and Lenis.

The whole site is one continuous 3D journey: as you scroll, the camera flies between "stations",
one per section.

| Section      | 3D station                                                             |
| ------------ | ---------------------------------------------------------------------- |
| Intro        | Liquid-metal core with orbital rings (follows your cursor)              |
| About        | **Interactive desk**: click the monitor, ESP32, certificates or phone  |
| Work         | Carousel of project screens that turns as you scroll                   |
| TrafficX     | Live traffic simulation: sensors ping, lights adapt to the queue       |
| Skills       | Tech constellation (hover a skill chip to light up its star)           |
| Certificates | Ring of your real certificates                                         |
| Contact      | Beacon that fires a burst when a message is sent                       |

Phones and low-power machines automatically get a lighter scene. People who prefer reduced motion
get native scrolling and calmer animation, and the **3D** button in the navbar turns the scene off
completely.

## Run locally

```bash
npm install
npm run dev
```

## Things to fill in

Everything lives in [`src/data/content.js`](src/data/content.js). Search for `TODO`:

- `SOCIAL_LINKS.email`: your email address
- `SOCIAL_LINKS.resume`: put `resume.pdf` in `/public` and set this to `/resume.pdf`
- `github` links for Khushi Fashion, Buskiबात and TrafficX

Empty values are hidden automatically, so the site never shows a broken button.

## Deploy (Vercel)

1. Push to GitHub and import the repo in Vercel (it detects Vite automatically).
2. Under **Settings → Environment Variables**, add `RESEND_API_KEY` and `RESEND_TO_EMAIL`
   (see `.env.example`) so the contact form can send email.
3. Optional: set `VITE_SITE_URL` if you use a custom domain.

## Structure

```
api/contact.js          Vercel function: validated, rate-limited, spam-protected email
src/data/content.js     All text, links, projects and certificates
src/components/         Page sections, navbar, loader, scroll UI
src/three/              3D scene: camera rig, stations, desk, simulation…
src/lib/store.js        Shared scroll/pointer state between the page and the 3D scene
public/certificates/    Optimised certificate images (originals in certificates-pic/)
```
