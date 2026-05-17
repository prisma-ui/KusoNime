export function cleanHtml(str) {
  if (!str) return "";
  return str
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#039;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&nbsp;/g, " ");
}

export function getImg(anime) {
  return (
    anime?.coverImage?.extraLarge ||
    anime?.coverImage?.large ||
    anime?.bannerImage ||
    anime?.image ||
    ""
  );
}

export function getBanner(anime) {
  return anime?.bannerImage || anime?.coverImage?.extraLarge || "";
}

export function getTitle(anime) {
  return (
    anime?.title?.english ||
    anime?.title?.romaji ||
    anime?.title?.native ||
    anime?.title ||
    ""
  );
}

export function getRomaji(anime) {
  return anime?.title?.romaji || "";
}

export function updateMeta(title, desc, img) {
  // Ambil SITE_NAME dari env (tanpa import circular — baca langsung dari import.meta.env)
  const siteName = import.meta.env.VITE_SITE_NAME || "AniStream";
  const siteTagline = import.meta.env.VITE_SITE_TAGLINE || "Watch Anime Free";
  const siteDesc = import.meta.env.VITE_SITE_DESCRIPTION || "Stream anime online free in HD.";

  document.title = title ? `${title} | ${siteName}` : `${siteName} — ${siteTagline}`;

  const mDesc = document.querySelector('meta[name="description"]');
  if (mDesc) mDesc.setAttribute("content", desc || siteDesc);

  const ogT = document.querySelector('meta[property="og:title"]');
  if (ogT) ogT.setAttribute("content", title || siteName);

  const ogI = document.querySelector('meta[property="og:image"]');
  if (ogI && img) ogI.setAttribute("content", img);
}
