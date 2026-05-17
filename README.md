# AniStream 🎌

Aplikasi streaming anime gratis berbasis React + Vite, menggunakan [Miruro API](https://miruro-api-dun.vercel.app).

## Fitur
- Spotlight hero carousel (auto-rotate)
- Halaman Home: Trending, Airing, Popular, Upcoming
- Halaman Browse dengan tab filter
- Pencarian anime dengan autocomplete suggestions
- Halaman Detail dengan info lengkap
- Video player dengan pilihan provider & kualitas
- Daftar episode per provider
- Rekomendasi anime terkait
- Responsive mobile-friendly

## Struktur Project

```
anistream/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── AnimeCard.jsx
│   │   ├── AnimeRow.jsx
│   │   ├── EpisodeList.jsx
│   │   ├── SearchBar.jsx
│   │   ├── SkeletonCards.jsx
│   │   ├── SpotlightHero.jsx
│   │   └── VideoPlayer.jsx
│   ├── hooks/
│   │   └── useApi.js
│   ├── pages/
│   │   ├── BrowsePage.jsx
│   │   ├── DetailPage.jsx
│   │   ├── HomePage.jsx
│   │   └── SearchPage.jsx
│   ├── utils/
│   │   ├── constants.js
│   │   └── helpers.js
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── index.html
├── vercel.json
├── vite.config.js
└── package.json
```

## Development

```bash
npm install
npm run dev
```

## Deploy ke Vercel

1. Push ke GitHub
2. Import repo di vercel.com
3. Framework Preset: Vite
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. Klik Deploy

vercel.json sudah dikonfigurasi untuk SPA routing.

## Deploy ke Render

1. Buat Static Site baru di render.com
2. Connect repo GitHub
3. Build Command: `npm install && npm run build`
4. Publish Directory: `dist`
5. Tambahkan Redirect Rule: `/* -> /index.html` (status 200)

## Catatan

Proyek ini hanya untuk tujuan edukasi. Seluruh data bersumber dari Miruro API.
