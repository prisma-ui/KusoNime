import { useState } from "react";
import { useApi } from "../hooks/useApi";
import VideoPlayer from "../components/VideoPlayer";
import EpisodeList from "../components/EpisodeList";
import AnimeCard from "../components/AnimeCard";
import { getTitle, getImg, getBanner, cleanHtml } from "../utils/helpers";
import { IconPlay, IconBack, IconStar } from "../components/Icons";

export default function DetailPage({ animeId, onBack, onRelated }) {
  const { data: infoData, loading } = useApi(`/info/${animeId}`, [animeId]);
  const { data: recsData }          = useApi(`/anime/${animeId}/recommendations`, [animeId]);
  const { data: charsData }         = useApi(`/anime/${animeId}/characters`, [animeId]);
  const { data: relData }           = useApi(`/anime/${animeId}/relations`, [animeId]);

  const [episode,      setEpisode]      = useState(null);
  const [descExpanded, setDescExpanded] = useState(false);
  const [activeTab,    setActiveTab]    = useState("episodes");

  if (loading)
    return (
      <div className="loading-full">
        <div className="spinner" />
        <p>Memuat detail anime...</p>
      </div>
    );
  if (!infoData)
    return <div className="error-msg"><h3>Anime tidak ditemukan</h3></div>;

  const anime  = infoData?.data || infoData;
  const title  = getTitle(anime);
  const desc   = cleanHtml(anime?.description);
  const banner = getBanner(anime);
  const img    = getImg(anime);
  const score  = anime?.averageScore || anime?.meanScore;
  const genres = anime?.genres || [];

  const recs = (() => {
    const fromEndpoint = recsData?.data || recsData?.results || recsData || [];
    if (Array.isArray(fromEndpoint) && fromEndpoint.length > 0) return fromEndpoint;
    const fromInfo = anime?.recommendations?.nodes || anime?.recommendations || [];
    return Array.isArray(fromInfo) ? fromInfo : [];
  })();

  const chars = (() => {
    const d = charsData?.data || charsData?.results || charsData || [];
    return Array.isArray(d) ? d : [];
  })();

  const rels = (() => {
    const d = relData?.data || relData?.results || relData || [];
    return Array.isArray(d) ? d : [];
  })();

  return (
    <div className="detail-page fade-in">
      {/* Hero banner - fixed height with no overlap */}
      <div className="detail-hero">
        {(banner || img) && (
          <div className="detail-hero-bg" style={{ backgroundImage: `url(${banner || img})` }} />
        )}
        <div className="detail-hero-grad" />
      </div>

      <div className="detail-body">
        <button className="back-btn" onClick={onBack}>
          <IconBack size={14} color="currentColor" /> Back
        </button>

        {/* Top info */}
        <div className="detail-top">
          <div className="detail-poster">
            {img && <img src={img} alt={title} />}
          </div>
          <div className="detail-meta">
            <h1 className="detail-title">{title}</h1>
            {anime?.title?.romaji && anime.title.romaji !== title && (
              <p className="detail-eng">{anime.title.romaji}</p>
            )}
            <div className="detail-stats">
              {score && (
                <div className="detail-stat">
                  <div className="detail-stat-val" style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <IconStar size={14} color="var(--accent)" />
                    {(score / 10).toFixed(1)}
                  </div>
                  <div className="detail-stat-lab">Score</div>
                </div>
              )}
              {anime?.episodes && (
                <div className="detail-stat">
                  <div className="detail-stat-val">{anime.episodes}</div>
                  <div className="detail-stat-lab">Episodes</div>
                </div>
              )}
              {anime?.duration && (
                <div className="detail-stat">
                  <div className="detail-stat-val">{anime.duration}m</div>
                  <div className="detail-stat-lab">Duration</div>
                </div>
              )}
              {anime?.seasonYear && (
                <div className="detail-stat">
                  <div className="detail-stat-val">{anime.seasonYear}</div>
                  <div className="detail-stat-lab">Year</div>
                </div>
              )}
              {anime?.popularity && (
                <div className="detail-stat">
                  <div className="detail-stat-val">{anime.popularity?.toLocaleString()}</div>
                  <div className="detail-stat-lab">Popularity</div>
                </div>
              )}
            </div>

            <div className="detail-genres">
              {anime?.format && (
                <span className={`format-badge format-${anime.format}`}>{anime.format}</span>
              )}
              {anime?.status && (
                <span className="genre-pill" style={{ color: anime.status === "RELEASING" ? "#34d399" : undefined }}>
                  {anime.status === "RELEASING" ? "Airing" : anime.status}
                </span>
              )}
              {genres.slice(0, 6).map((g) => (
                <span key={g} className="genre-pill">{g}</span>
              ))}
            </div>

            <button
              className="btn btn-primary"
              onClick={() => document.getElementById("ep-section")?.scrollIntoView({ behavior: "smooth" })}
            >
              <IconPlay size={16} color="white" /> Watch
            </button>
          </div>
        </div>

        {/* Description */}
        {desc && (
          <div style={{ marginTop: "1.5rem" }}>
            <p className={`detail-desc ${descExpanded ? "" : "collapsed"}`}>{desc}</p>
            <button className="toggle-desc" onClick={() => setDescExpanded((e) => !e)}>
              {descExpanded ? "Tampilkan lebih sedikit ↑" : "Tampilkan lebih ↓"}
            </button>
          </div>
        )}

        {/* Video Player */}
        <div id="ep-section">
          <VideoPlayer animeId={animeId} episode={episode} />
        </div>

        {/* Tabs */}
        <div className="page-tabs" style={{ marginTop: "1.5rem" }}>
          {[
            { id: "episodes",   label: "Episodes" },
            { id: "characters", label: `Characters${chars.length ? ` (${chars.length})` : ""}` },
            { id: "relations",  label: `Relations${rels.length ? ` (${rels.length})` : ""}` },
          ].map((t) => (
            <button
              key={t.id}
              className={`page-tab ${activeTab === t.id ? "active" : ""}`}
              onClick={() => setActiveTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {activeTab === "episodes" && (
          <EpisodeList animeId={animeId} onEpSelect={setEpisode} currentEp={episode} />
        )}

        {activeTab === "characters" && (
          <div style={{ padding: "1.5rem 0" }}>
            {chars.length === 0 ? (
              <p style={{ color: "var(--muted)", fontSize: "0.85rem" }}>Data karakter tidak tersedia.</p>
            ) : (
              <div className="chars-grid">
                {chars.slice(0, 24).map((c, i) => {
                  const ch   = c?.node || c;
                  const name = ch?.name?.full || ch?.name?.userPreferred || ch?.name || "—";
                  const img  = ch?.image?.large || ch?.image?.medium || ch?.image || "";
                  const role = c?.role || ch?.role || "";
                  return (
                    <div key={i} className="char-card">
                      {img && <img src={img} alt={name} loading="lazy" />}
                      <div className="char-info">
                        <div className="char-name">{name}</div>
                        {role && <div className="char-role">{role}</div>}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === "relations" && (
          <div style={{ padding: "1.5rem 0" }}>
            {rels.length === 0 ? (
              <p style={{ color: "var(--muted)", fontSize: "0.85rem" }}>Data relasi tidak tersedia.</p>
            ) : (
              <div className="anime-grid">
                {rels.slice(0, 12).map((r, i) => {
                  const rel = r?.node || r;
                  if (!rel?.id) return null;
                  return (
                    <div key={i} style={{ position: "relative" }}>
                      {r?.relationType && (
                        <div style={{
                          position: "absolute", top: 6, left: 6, zIndex: 2,
                          background: "rgba(0,0,0,0.75)", color: "var(--accent2)",
                          fontSize: "0.65rem", fontWeight: 700, padding: "2px 6px",
                          borderRadius: 4, textTransform: "uppercase",
                        }}>
                          {r.relationType}
                        </div>
                      )}
                      <AnimeCard anime={rel} onClick={() => onRelated(rel.id)} />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {recs.length > 0 && (
          <div style={{ marginTop: "2.5rem" }}>
            <h3 className="section-title" style={{ marginBottom: "1rem" }}>Rekomendasi</h3>
            <div className="anime-grid">
              {recs.slice(0, 12).map((r, i) => {
                const rec = r?.node?.mediaRecommendation || r?.node || r?.media || r;
                if (!rec?.id) return null;
                return <AnimeCard key={i} anime={rec} onClick={() => onRelated(rec.id)} />;
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
