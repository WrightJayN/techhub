# Tech Hub — Setup Guide

## 1. Install dependencies

```bash
npm install
```

## 2. Set up Sanity CMS

### 2a. Create your Sanity project
1. Go to [sanity.io](https://sanity.io) → sign in → **New project**
2. Name: `Tech Hub` · Dataset: `production`
3. Copy your **Project ID** from the project dashboard

### 2b. Install the Sanity Studio
```bash
npm create sanity@latest -- --project YOUR_PROJECT_ID --dataset production --output-path studio
```

Or manually install inside the `studio/` folder:
```bash
cd studio
npm install sanity @sanity/vision
```

### 2c. Replace the project ID
In `studio/sanity.config.ts`, replace `YOUR_PROJECT_ID` with your real ID.

Also create a `.env` file in the project root:
```
PUBLIC_SANITY_PROJECT_ID=your_project_id_here
PUBLIC_SANITY_DATASET=production
```

### 2d. Add your CORS origin in Sanity
In [sanity.io/manage](https://sanity.io/manage) → your project → **API** → **CORS Origins**:
- Add `http://localhost:4321` (dev)
- Add your Netlify URL once deployed (e.g. `https://thehub.netlify.app`)

### 2e. Run the Studio
```bash
cd studio
npx sanity dev
```
Studio runs at `http://localhost:3333`

### 2f. Seed your first content
In the Studio:
1. **Authors** → Create yourself as an author first
2. **Categories** → Add: Tutorial, Community, Opinion, News
3. **Blog Posts** → Write your first post
4. **Events** → Add upcoming Hub events

---

## 3. Run the website locally

```bash
# From the project root
npm run dev
```
Site runs at `http://localhost:4321`

---

## 4. Deploy to Netlify

### 4a. Push to GitHub
```bash
git init
git add .
git commit -m "Initial Hub website"
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

### 4b. Connect to Netlify
1. Go to [netlify.com](https://netlify.com) → **Add new site** → **Import from Git**
2. Select your repo
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Under **Environment variables**, add:
   - `PUBLIC_SANITY_PROJECT_ID` = your project ID
   - `PUBLIC_SANITY_DATASET` = `production`

### 4c. Enable Netlify Forms
The Join form (`/join`) uses Netlify Forms automatically — no extra config needed.
After deploying, go to Netlify dashboard → **Forms** to see submissions.

---

## 5. Connect Google Sheets via Zapier

1. Go to [zapier.com](https://zapier.com) → **Create Zap**
2. Trigger: **Netlify** → **New Form Submission** → select `hub-membership` form
3. Action: **Google Sheets** → **Create Spreadsheet Row**
4. Map fields: `name`, `email`, `programme`, `year`
5. Turn on the Zap

New member sign-ups will now appear in your Google Sheet automatically.

---

## Content Schema Summary

| Type | Fields |
|---|---|
| **Post** | title, slug, author, category, coverImage, excerpt, body, publishedAt |
| **Author** | name, slug, photo, role, bio |
| **Category** | title, description |
| **Event** | title, date, location, description, registrationLink, coverImage |
