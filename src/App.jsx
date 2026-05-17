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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const goAnime = (anime) => {
    const id = anime?.id || anime?.anilistId || anime?.mediaId;
    if (!id) return;
    setDetailId(id);
    setPage("detail");
    updateMeta(getTitle(anime), cleanHtml(anime?.description)?.slice(0, 160), getImg(anime));
    window.scrollTo(0, 0);
    setMobileMenuOpen(false);
  };

  const goSearch = (q) => {
    setSearchQuery(q);
    setPage("search");
    updateMeta(`Search: ${q}`, `Find anime: ${q} on ${SITE_NAME}`);
    window.scrollTo(0, 0);
    setMobileMenuOpen(false);
  };

  const goHome = () => {
    setPage("home");
    updateMeta(null, null, null);
    window.scrollTo(0, 0);
    setMobileMenuOpen(false);
  };

  const goBrowse = () => {
    setPage("browse");
    updateMeta("Browse Anime", `Browse trending, popular and upcoming anime on ${SITE_NAME}`);
    window.scrollTo(0, 0);
    setMobileMenuOpen(false);
  };

  const goSchedule = () => {
    setPage("schedule");
    updateMeta("Jadwal Tayang", "Jadwal tayang anime mingguan");
    window.scrollTo(0, 0);
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { label: "Home", id: "home", action: goHome },
    { label: "Browse", id: "browse", action: goBrowse },
    { label: "Jadwal", id: "schedule", action: goSchedule },
  ];

  return (
    <div className="app">
      <nav className="nav">
        <div className="nav-logo" onClick={goHome}>
          <IconLogo size={26} color={ACCENT_COLOR} />
          Ani<span>Stream</span>
        </div>

        <div className="nav-links">
          {navLinks.map(l => (
            <button
              key={l.id}
              className={`nav-link ${page === l.id ? "active" : ""}`}
              onClick={l.action}
            >
              {l.label}
            </button>
          ))}
        </div>

        <div style={{ flex: 1 }} />
        <SearchBar onSearch={goSearch} />

        <button
          className="hamburger"
          onClick={() => setMobileMenuOpen(o => !o)}
          aria-label="Toggle menu"
        >
          <span className={mobileMenuOpen ? "ham-open" : ""}>
            <span /><span /><span />
          </span>
        </button>
      </nav>

      {mobileMenuOpen && (
        <div className="mobile-menu">
          {navLinks.map(l => (
            <button
              key={l.id}
              className={`mobile-menu-item ${page === l.id ? "active" : ""}`}
              onClick={l.action}
            >
              {l.label}
            </button>
          ))}
        </div>
      )}

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

      <footer className="footer">
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
