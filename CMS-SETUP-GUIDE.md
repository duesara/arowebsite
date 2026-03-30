# Aro Photography — Decap CMS Setup Guide

## What This Does

Once set up, Aro can log into **arajabar.com/admin** and:
- Drag and drop new photos directly into the portfolio
- Set the title, category, and whether it shows on the home page
- Hit "Publish" — the site updates automatically within ~60 seconds

No code editing. No FTP. No technical knowledge needed.

---

## One-Time Setup (You Do This)

### Step 1 — Push the site to GitHub

Create a GitHub repo (e.g. `arajabarr/aro-photography`) and push all the website files to it. The repo must be public (or you need a Netlify Pro plan for private repos).

```bash
git init
git add .
git commit -m "Initial site"
git remote add origin https://github.com/YOUR_USERNAME/aro-photography.git
git push -u origin main
```

### Step 2 — Connect Netlify to the GitHub repo

1. Go to https://app.netlify.com/projects/araswebsite
2. Go to **Site configuration → Build & deploy → Continuous deployment**
3. Connect to your GitHub repo
4. Set the **Publish directory** to `/` (root, since this is a plain HTML site)
5. No build command needed

### Step 3 — Update the CMS config

Open `admin/config.yml` and replace the placeholder on line 2:
```yaml
repo: YOUR_GITHUB_USERNAME/YOUR_REPO_NAME
```
With your actual repo, e.g.:
```yaml
repo: arajabarr/aro-photography
```

### Step 4 — Enable Netlify Identity

1. In Netlify, go to **Site configuration → Identity**
2. Click **Enable Identity**
3. Under **Registration**, set to **Invite only** (so only Aro can log in)
4. Under **External providers**, enable **GitHub** (optional but convenient)
5. Scroll to **Services → Git Gateway** and click **Enable Git Gateway**
   - This is what allows the CMS to commit to GitHub on Aro's behalf

### Step 5 — Invite Aro as a user

1. Still in the Identity section, click **Invite users**
2. Enter Aro's email address
3. She'll get an email to set a password — that's her CMS login

### Step 6 — Add the Identity widget to the site

Add this script tag to the `<head>` of `index.html`, `portfolio.html`, `contact.html`, and `booking.html`:

```html
<script src="https://identity.netlify.com/v1/netlify-identity-widget.js"></script>
```

And add this snippet just before `</body>` in each HTML file:

```html
<script>
  if (window.netlifyIdentity) {
    window.netlifyIdentity.on("init", user => {
      if (!user) {
        window.netlifyIdentity.on("login", () => {
          document.location.href = "/admin/";
        });
      }
    });
  }
</script>
```

---

## How Aro Updates Her Portfolio (Her Instructions)

1. Go to **arajabar.com/admin**
2. Log in with your email and password
3. Click **"Portfolio"** in the left sidebar
4. Click **"New Photo"** (top right)
5. Fill in:
   - **Photo Title** — something evocative like "Summer Light"
   - **Category** — choose from the dropdown
   - **Photo** — drag and drop your image file here
   - **Alt Text** — briefly describe the photo
   - **Show on Home Page** — toggle on if you want it featured
   - **Sort Order** — lower number = appears earlier in the gallery
6. Click **"Publish"** — the site will update within about 60 seconds

To **remove a photo**: click on it in the list, scroll to the bottom, click **Delete**.
To **reorder photos**: change the Sort Order number and republish.

---

## File Structure Reference

```
aro-photography/
├── admin/
│   ├── index.html          ← CMS login UI (don't touch)
│   └── config.yml          ← CMS configuration (you configured this)
├── _portfolio/
│   ├── portfolio-index.json  ← Auto-updated by CMS (don't touch manually)
│   └── *.md                  ← One file per photo (managed by CMS)
├── _data/
│   ├── contact.json          ← Editable in CMS under Site Settings
│   └── pricing.json          ← Editable in CMS under Site Settings
├── images/
│   └── uploads/              ← Photos uploaded via CMS land here
├── index.html
├── portfolio.html
├── contact.html
├── booking.html
├── styles.css
└── main.js
```

---

## Troubleshooting

**"Not authorized" when logging into /admin**
→ Make sure Git Gateway is enabled in Netlify Identity settings.

**Photos not showing after publishing**
→ Wait 60 seconds for Netlify to redeploy. Check the Deploys tab in Netlify for errors.

**"Failed to load portfolio" on the website**
→ Make sure `_portfolio/portfolio-index.json` exists and is valid JSON.

**CMS shows but won't save**
→ Check that the GitHub repo name in `admin/config.yml` matches exactly.
