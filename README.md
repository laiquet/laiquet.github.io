# Talha Laique — Portfolio

Personal portfolio site. Static HTML, CSS and vanilla JavaScript — no build step, no dependencies.

## Files

```
index.html          the whole page
styles.css          design tokens + layout (light/dark themes)
script.js           theme toggle, mobile nav, scroll spy, reveal, project filters
assets/talha.jpg    profile photo
assets/…Resume.pdf  résumé download  ← you need to add this (see below)
picture.jpg         original photo (kept as the source copy)
.nojekyll           tells GitHub Pages to serve files as-is
```

## The résumé download

The site offers the résumé in two places — the hero button and a download panel in the
Contact section — both pointing at one stable file: **`assets/resume.pdf`**.

There's also a short permanent URL, **`<your-site>/resume`** (from `resume/index.html`),
which forwards to that PDF. **That's the link to print on the résumé itself** — it stays
valid no matter how many times you swap the file.

### Publishing an updated résumé (30 seconds)

1. Save the new PDF over `assets/resume.pdf` — same filename, always.
2. In `index.html`, bump the version stamp in **both** résumé links —
   search for `?v=2026-08` and change it to the current month, e.g. `?v=2026-11`.
   This defeats browser and CDN caching so recruiters get the new file, not a cached
   copy of the old one.
3. In the Contact section, update the "last updated" date:
   `<time datetime="2026-08">August 2026</time>`.
4. Commit and push. Live in about a minute.

Skipping step 2 usually still works — GitHub Pages caches for ~10 minutes — but anyone
who already downloaded the old PDF may keep getting it from their browser cache. The
version bump makes it deterministic.

### While the PDF isn't uploaded yet

`script.js` does a `HEAD` request on load and hides both résumé links if the file returns
404, so the site never shows a recruiter a dead download. The links reappear on their own
the moment you upload the PDF — nothing else to change. They also stay visible if
JavaScript is off or the check fails, so a working link is never hidden by mistake.

## Before you publish — decide on the URL

GitHub user sites are named after the account, so:

| You want | What's needed |
|---|---|
| `laiquet.github.io` | Nothing — this works today with your current username. |
| `talhalaique.github.io` | Rename the GitHub account from `laiquet` to `talhalaique` (Settings → Account → Change username). GitHub redirects the old repo URLs, but every `github.com/laiquet/...` link in `index.html` should then be updated to `talhalaique`. |
| A custom domain | Buy a domain, add a `CNAME` file containing it, point DNS at GitHub Pages. |

If you rename the account, also update the `<link rel="canonical">` and the
project links in `index.html` — a find-and-replace of `laiquet` → `talhalaique` covers it.

## Deploying

```bash
git init
git add .
git commit -m "Portfolio site"
git branch -M main
git remote add origin https://github.com/laiquet/laiquet.github.io.git
git push -u origin main
```

The repo **must** be named `<username>.github.io` for a user site. Then in the repo:
Settings → Pages → Source: *Deploy from a branch* → `main` / `/ (root)`. Live in ~1 minute.

To host it as a project page instead (e.g. `laiquet.github.io/portfolio`), name the repo
anything you like — the relative asset paths already work either way.

## Previewing locally

```bash
python -m http.server 8000
# then open http://localhost:8000
```

## Editing content

Everything is plain HTML in `index.html`, in section order: hero → about → experience →
projects → publications → skills/education → contact.

- **Add a project:** copy any `<article class="card">` block. `data-tags` controls the
  filter buttons and accepts `cv`, `mlops`, `genai` (space-separated, multiple allowed).
- **Change colours:** the `--accent` / `--accent-2` variables at the top of `styles.css`,
  once under `:root` (light) and once under `html[data-theme="dark"]`.
- **Publication links** point at Google Scholar searches rather than hardcoded DOIs, so
  they can't rot. Swap in real DOI/MDPI URLs whenever you want.
