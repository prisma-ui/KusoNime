import { useState, useEffect } from "react";
import { useApi } from "../hooks/useApi";

/**
 * /episodes/:animeId → { zoro: [...], gogoanime: [...], ... }
 * Setiap episode: { id, number, title, slug, isFiller, ... }
 * Slug diteruskan ke VideoPlayer → /watch/:provider/:id/:cat/:slug
 */
export default function EpisodeList({ animeId, onEpSelect, currentEp }) {
  const { data, loading, error } = useApi(`/episodes/${animeId}`, [animeId]);
  const [provider, setProvider] = useState(null);
  const [search, setSearch]     = useState("");

  // data bisa berupa { zoro:[...], gogoanime:[...] } atau langsung array
  const isObject   = data && !Array.isArray(data);
  const providers  = isObject ? Object.keys(data) : (data ? ["default"] : []);
  const epMap      = isObject ? data : (data ? { default: data } : {});

  useEffect(() => {
    if (providers.length && !provider) setProvider(providers[0]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [providers.join(",")]);

  if (loading)
    return <div className="loading-full"><div className="spinner" /></div>;
  if (error || !data || providers.length === 0)
    return <div className="error-msg"><p>Episode tidak ditemukan.</p></div>;

  const episodes = (provider ? epMap[provider] : []) || [];
  const filtered = search
    ? episodes.filter(
        (ep) =>
          String(ep?.number || "").includes(search) ||
          (ep?.title || "").toLowerCase().includes(search.toLowerCase())
      )
    : episodes;

  return (
    <div className="ep-section">
      {/* Provider tabs */}
      <div className="ep-tabs">
        {providers.map((p) => (
          <button
            key={p}
            className={`ep-tab ${provider === p ? "active" : ""}`}
            onClick={() => { setProvider(p); setSearch(""); }}
          >
            {p.charAt(0).toUpperCase() + p.slice(1)}
          </button>
        ))}
      </div>

      {/* Search episode */}
      {episodes.length > 20 && (
        <input
          type="number"
          placeholder="Cari nomor episode..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            background: "var(--surface)", border: "1px solid var(--border2)",
            color: "var(--text)", borderRadius: "var(--radius)", padding: "6px 12px",
            fontSize: "0.82rem", width: "100%", marginBottom: "0.8rem",
            fontFamily: "var(--font)", outline: "none",
          }}
        />
      )}

      {filtered.length === 0 ? (
        <p style={{ color: "var(--muted)", fontSize: "0.85rem" }}>Tidak ada episode.</p>
      ) : (
        <div className="ep-grid">
          {filtered.map((ep, i) => {
            const epNum  = ep?.number ?? ep?.num ?? (i + 1);
            const epId   = ep?.id || ep?.episodeId || ep?.slug || String(epNum);
            const epSlug = ep?.slug || ep?.id || String(epNum);
            const isCur  = currentEp?.id === epId;
            return (
              <button
                key={i}
                className={`ep-btn ${isCur ? "current" : ""} ${ep?.isFiller ? "filler" : ""}`}
                title={ep?.title ? `${epNum}: ${ep.title}` : `Episode ${epNum}`}
                onClick={() =>
                  onEpSelect({
                    ...ep,
                    _provider: provider,
                    id:   epId,
                    slug: epSlug,
                    num:  epNum,
                  })
                }
              >
                {epNum}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
