import { useState, useEffect } from "react";
import { API_BASE } from "../utils/constants";
import { IconPlay, IconWarning, IconTv } from "./Icons";

export default function VideoPlayer({ animeId, episode }) {
  const [streamUrl, setStreamUrl] = useState(null);
  const [sources,   setSources]   = useState([]);
  const [srcIdx,    setSrcIdx]    = useState(0);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState(null);
  const [category,  setCategory]  = useState("sub");

  useEffect(() => {
    if (!episode) {
      setStreamUrl(null);
      setSources([]);
      setError(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setStreamUrl(null);
    setSources([]);
    setError(null);
    setSrcIdx(0);

    const provider = episode?._provider || "zoro";
    const cat      = episode?.category || category;
    const slug     = episode?.slug || episode?.id;

    const fetchSources = (epId) =>
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
        });

    fetch(`${API_BASE}/watch/${provider}/${animeId}/${cat}/${encodeURIComponent(slug)}`)
      .then((r) => r.json())
      .then((watchData) => {
        const epId = watchData?.episodeId || watchData?.id || slug;
        return fetchSources(epId);
      })
      .catch(() => {
        const epId = episode?.id || episode?.episodeId || slug;
        if (!epId) {
          setError("Episode ID tidak ditemukan. Coba episode lain.");
          setLoading(false);
          return;
        }
        fetchSources(epId).catch(() => {
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

  if (!episode)
    return (
      <div className="player-section">
        <div className="player-placeholder">
          <div className="player-placeholder-icon">
            <IconPlay size={48} color="var(--accent)" />
          </div>
          <p>Pilih episode untuk mulai menonton</p>
        </div>
      </div>
    );

  return (
    <div className="player-section">
      <div className="player-header">
        <span className="player-ep-title">
          Episode {episode?.num || episode?.number}
          {episode?.title ? ` — ${episode.title}` : ""}
        </span>

        <div style={{ marginLeft: "auto", display: "flex", gap: 4, flexWrap: "wrap" }}>
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

      {/* Player container - always render with explicit dimensions */}
      <div className="player-container">
        {loading && (
          <div className="player-state">
            <div className="spinner" />
            <p>Memuat sumber video...</p>
          </div>
        )}
        {!loading && error && (
          <div className="player-state">
            <IconWarning size={40} color="var(--accent2)" />
            <p>{error}</p>
          </div>
        )}
        {!loading && !error && !streamUrl && (
          <div className="player-state">
            <IconTv size={40} color="var(--muted2)" />
            <p>Tidak ada sumber video. Coba provider lain.</p>
          </div>
        )}
        {!loading && !error && streamUrl && (
          <iframe
            key={streamUrl}
            src={streamUrl}
            allowFullScreen
            allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
            title={`Episode ${episode?.num}`}
            referrerPolicy="no-referrer"
            sandbox="allow-scripts allow-same-origin allow-presentation allow-popups allow-forms"
            style={{ width: "100%", height: "100%", border: "none", display: "block", background: "#000" }}
          />
        )}
      </div>
    </div>
  );
}
