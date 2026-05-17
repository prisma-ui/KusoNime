import { useState } from "react";
import SearchBar from "./components/SearchBar";
import HomePage from "./pages/HomePage";
import BrowsePage from "./pages/BrowsePage";
import SearchPage from "./pages/SearchPage";
import DetailPage from "./pages/DetailPage";
import SchedulePage from "./pages/SchedulePage";
import { IconLogo } from "./components/Icons";
import { getTitle, getImg, cleanHtml, updateMeta } from "./utils/helpers";
import { SITE_NAME, FOOTER_TEXT, API_LINK, ACCENT_COLOR } from "./utils/constants";

export default function App() {
  const [page, setPage]             = useState("home");
  const [searchQuery, setSearchQuery] = useState("");
  const [detailId, setDetailId]     = useState(null);

  const goAnime = (anime) => {
    const id = anime?.id || anime?.anilistId || anime?.mediaId;
    if (!id) return;
    setDetailId(id);
    setPage("detail");
    updateMeta(getTitle(anime), cleanHtml(anime?.description)?.slice(0, 160), getImg(anime));
    window.scrollTo(0, 0);
  };

  const goSearch = (q) => {
    setSearchQuery(q);
    setPage("search");
    updateMeta(`Search: ${q}`, `Find anime: ${q} on ${SITE_NAME}`);
    window.scrollTo(0, 0);
  };

  const goHome = () => {
    setPage("home");
    updateMeta(null, null, null);
    window.scrollTo(0, 0);
  };

  const goBrowse = () => {
    setPage("browse");
    updateMeta("Browse Anime", `Browse trending, popular and upcoming anime on ${SITE_NAME}`);
    window.scrollTo(0, 0);
  };

  const goSchedule = () => {
    setPage("schedule");
    updateMeta("Jadwal Tayang", "Jadwal tayang anime mingguan");
    window.scrollTo(0, 0);
  };

  return (
    <div className="app">
      <nav className="nav">
        <div className="nav-logo" onClick={goHome}>
          <IconLogo size={26} color={ACCENT_COLOR} />
          Ani<span>Stream</span>
        </div>
        <div className="nav-links">
          <button className={`nav-link ${page === "home" ? "active" : ""}`} onClick={goHome}>Home</button>
          <button className={`nav-link ${page === "browse" ? "active" : ""}`} onClick={goBrowse}>Browse</button>
          <button className={`nav-link ${page === "schedule" ? "active" : ""}`} onClick={goSchedule}>Jadwal</button>
        </div>
        <div style={{ flex: 1 }} />
        <SearchBar onSearch={goSearch} />
      </nav>

      <main style={{ flex: 1 }}>
        {page === "home"     && <HomePage    onAnimeClick={goAnime} />}
        {page === "browse"   && <BrowsePage  onAnimeClick={goAnime} />}
        {page === "schedule" && <SchedulePage onAnimeClick={goAnime} />}
        {page === "search"   && <SearchPage  query={searchQuery} onAnimeClick={goAnime} />}
        {page === "detail"   && detailId && (
          <DetailPage
            animeId={detailId}
            onBack={() => { setPage("home"); updateMeta(); }}
            onRelated={(id) => { setDetailId(id); window.scrollTo(0, 0); }}
          />
        )}
      </main>

      <footer style={{
        borderTop: "1px solid var(--border)",
        padding: "1.5rem 2rem",
        color: "var(--muted2)",
        fontSize: "0.8rem",
        textAlign: "center",
      }}>
        <p>
          {FOOTER_TEXT.split("Miruro API").map((part, i) =>
            i === 0 ? <span key={i}>{part}</span> : (
              <span key={i}>
                <a href={API_LINK} style={{ color: "var(--accent)", textDecoration: "none" }}>Miruro API</a>
                {part}
              </span>
            )
          )}
        </p>
      </footer>
    </div>
  );
}
