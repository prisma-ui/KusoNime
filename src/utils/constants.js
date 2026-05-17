// Semua konfigurasi diambil dari .env — ubah nilai di file .env
export const API_BASE        = import.meta.env.VITE_API_BASE || "https://miruro-api-dun.vercel.app";

export const SITE_NAME       = import.meta.env.VITE_SITE_NAME || "AniStream";
export const SITE_TAGLINE    = import.meta.env.VITE_SITE_TAGLINE || "Watch Anime Free";
export const SITE_DESC       = import.meta.env.VITE_SITE_DESCRIPTION || "Stream anime online for free in HD.";
export const SITE_URL        = import.meta.env.VITE_SITE_URL || "";

export const ACCENT_COLOR    = import.meta.env.VITE_ACCENT_COLOR || "#e85d26";
export const ACCENT_COLOR2   = import.meta.env.VITE_ACCENT_COLOR2 || "#f97316";
export const BG_COLOR        = import.meta.env.VITE_BG_COLOR || "#080c14";

export const SPOTLIGHT_COUNT    = Number(import.meta.env.VITE_SPOTLIGHT_COUNT) || 6;
export const SPOTLIGHT_INTERVAL = Number(import.meta.env.VITE_SPOTLIGHT_INTERVAL) || 6000;

export const SEARCH_SUGGESTIONS = Number(import.meta.env.VITE_SEARCH_SUGGESTIONS) || 6;
export const SEARCH_DEBOUNCE    = Number(import.meta.env.VITE_SEARCH_DEBOUNCE) || 300;

export const FOOTER_TEXT     = import.meta.env.VITE_FOOTER_TEXT || "AniStream · For educational purposes only";
export const API_LINK        = import.meta.env.VITE_API_LINK || API_BASE;
