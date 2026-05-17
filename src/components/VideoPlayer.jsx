import { useState, useEffect } from "react";
import { API_BASE } from "../utils/constants";
import { IconPlay } from "./Icons";

/**
 * Alur streaming yang benar (sesuai docs Miruro API):
 *   1. /episodes/:id          → dapat list episode + slug per provider
 *   2. /watch/:provider/:id/:cat/:slug → dapat episodeId final
 *   3. /sources?episodeId=... → dapat stream URL / embed
 *
 * episode prop berisi: { id, num, title, slug, _provider, category }
 */
export default function VideoPlayer({ animeId, episode }) {
  const [streamUrl, setStreamUrl] = useState(null);
  const [sources,   setSources]   = useState([]);
  const [srcIdx,    setSrcIdx]    = useState(0);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState(null);
  const [category,  setCategory]  = useState("sub");

  useEffect(() => {
    if (!episode) return;
    setLoading(true);
    setStreamUrl(null);
    setSources([]);
    setError(null);
    setSrcIdx(0);

    const provider = episode?._provider || "zoro";
    const cat      = episode?.category || category;
    const slug     = episode?.slug || episode?.id;

    // Step 2 — /watch/:provider/:animeId/:cat/:slug
    fetch(`${API_BASE}/watch/${provider}/${animeId}/${cat}/${encodeURIComponent(slug)}`)
      .then((r) => r.json())
      .then((watchData) => {
        const epId = watchData?.episodeId || watchData?.id || slug;

        // Step 3 — /sources
        return fetch(
          `${API_BASE}/sources?episodeId=${encodeURIComponent(epId)}&provider=${provider}&anilistId=${animeId}&category=${cat}`
        );
      })
      .then((r) => r.json())
      .then((d) => {
        const srcs   = d?.sources || d?.data?.sources || [];
        const embed  = d?.embed   || d?.data?.embed   || null;
        setSources(srcs);
        setStreamUrl(embed || srcs[0]?.url || srcs[0]?.file || null);
        setLoading(false);
      })
      .catch(() => {
        // Fallback: coba /sources langsung tanpa /watch
        const epId = episode?.id || episode?.episodeId;
        fetch(
          `${API_BASE}/sources?episodeId=${encodeURIComponent(epId)}&provider=${provider}&anilistId=${animeId}&category=${cat}`
        )
          .then((r) => r.json())
          .then((d) => {
            const srcs  = d?.sources || d?.data?.sources || [];
            const embed = d?.embed   || d?.data?.embed   || null;
            setSources(srcs);
            setStreamUrl(embed || srcs[0]?.url || srcs[0]?.file || null);
            setLoading(false);
          })
          .catch(() => {
            setError("Sumber video tidak ditemukan. Coba provider atau episode lain.");
            setLoading(false);
          });
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [episode?.id, episode?.slug, animeId, category]);

  const switchSource = (i) => {
    setSrcIdx(i);
    const s = sources[i];
    setStreamUrl(s?.url || s?.file || null);
  };

  /* ── Placeholder ── */
  if (!episode)
    return (
      <div className="player-section">
        <div className="player-placeholder">
          <IconPlay size={48} color="var(--muted2)" />
          <p>Pilih episode untuk mulai menonton</p>
        </div>
      </div>
    );

  return (
    <div className="player-section">
      {/* Header */}
      <div className="player-header">
        <span className="player-ep-title">
          Episode {episode?.num || episode?.number}
          {episode?.title ? ` — ${episode.title}` : ""}
        </span>

        {/* Sub / Dub toggle */}
        <div className="player-cat-tabs" style={{ marginLeft: "auto", display: "flex", gap: 4 }}>
          {["sub", "dub"].map((c) => (
            <button
              key={c}
              className={`ep-tab ${category === c ? "active" : ""}`}
              style={{ fontSize: "0.72rem", padding: "3px 10px" }}
              onClick={() => setCategory(c)}
            >
              {c.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Quality tabs */}
        {sources.length > 1 && (
          <div className="player-provider-tabs">
            {sources.map((s, i) => (
              <button
                key={i}
                className={`ep-tab ${i === srcIdx ? "active" : ""}`}
                onClick={() => switchSource(i)}
                style={{ fontSize: "0.72rem", padding: "3px 10px" }}
              >
                {s?.quality || s?.label || `Q${i + 1}`}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Player */}
      <div className="player-container">
        {loading && (
          <div className="source-loading">
            <div className="spinner" />
            <p style={{ color: "var(--muted)", fontSize: "0.85rem" }}>Memuat sumber video...</p>
          </div>
        )}
        {!loading && error && (
          <div className="source-loading">
            <p style={{ color: "var(--muted)", fontSize: "0.85rem" }}>⚠️ {error}</p>
          </div>
        )}
        {!loading && !error && streamUrl && (
          <iframe
            src={streamUrl}
            allowFullScreen
            allow="autoplay; fullscreen; picture-in-picture"
            title={`Episode ${episode?.num}`}
          />
        )}
        {!loading && !error && !streamUrl && (
          <div className="source-loading">
            <p style={{ color: "var(--muted)", fontSize: "0.85rem" }}>
              Tidak ada sumber video. Coba provider lain.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
