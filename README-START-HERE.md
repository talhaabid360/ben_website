# To My Sons & Daughters — Website Template

This download contains the complete editable source code, including all current podcast artwork and episode thumbnails.

## Run it locally

1. Install Node.js 22 or newer.
2. Open this folder in a terminal.
3. Run `npm install`.
4. Run `npm run dev`.
5. Open the local address printed in the terminal.

## Put it on Netlify

The included `netlify.toml` is already configured for this Next.js project. The most reliable workflow is:

1. Put this folder in a GitHub repository.
2. In Netlify, choose **Add new site → Import an existing project**.
3. Connect that repository and deploy.

You can also use Netlify's manual deploy flow while logged in, but importing the source repository makes later client revisions much easier.

## Replace images

- Brand mark: `public/media/podcast-mark.webp`
- Main cover/host art: `public/media/podcast-cover.webp`
- Episode thumbnails: `public/media/episodes/episode-01.webp` through `episode-07.webp`

Keep the same filenames to replace images without editing code. Episode links, titles and filters are in `app/page.tsx` near the top of the file.

## Main files

- `app/page.tsx` — page content, episode data, interactions and GSAP parallax motion
- `app/globals.css` — layout, colors, typography, responsive design and visual effects
- `app/layout.tsx` — page metadata and font setup
- `public/media` — all visual assets

The opening uses GSAP ScrollTrigger. Its sticky scene is 430 viewport-heights on desktop so the background, title, portrait, seal, journal, compass and microphone can move at separate speeds.
