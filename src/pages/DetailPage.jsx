import { useState } from "react";
import { useApi } from "../hooks/useApi";
import VideoPlayer from "../components/VideoPlayer";
import EpisodeList from "../components/EpisodeList";
import AnimeCard from "../components/AnimeCard";
import { getTitle, getImg, getBanner, cleanHtml } from "../utils/helpers";
import { IconPlay, IconBack, IconStar } from "../components/Icons";

export default function DetailPage({ animeId, onBack, onRelated }) {
  // All data (characters, relations, recommendations) is embedded in the /info response.
  // The separate /anime/:id/characters etc. endpoints do not exist on this API.
  const { data: infoData, loading, error: infoError } = useApi(`/info/${animeId}`, [animeId]);

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

  // Show error if fetch failed
  if (infoError)
    return <div className="error-msg"><h3>Gagal memuat: {infoError}</h3></div>;

  // Extract anime — API may return the object directly or wrapped in .data
  const anime = infoData?.data || infoData;

  // Validate the anime object has real content (guards against API error payloads)
  const title = getTitle(anime);
  if (!anime || (!title && !anime?.id))
    return <div className="error-msg"><h3>Anime tidak ditemukan</h3></div>;

  const desc   = cleanHtml(anime?.description);
  const banner = getBanner(anime);
  const img    = getImg(anime);
  const score  = anime?.averageScore || anime?.meanScore;
  const genres = anime?.genres || [];

  // --- Extract characters from /info response ---
  // AniList format: { characters: { edges: [{ node, role }] } }
  // Consumet flat:  { characters: [{ id, name, image, role }] }
  const chars = (() => {
    const raw = anime?.characters;
    if (!raw) return [];
    // AniList edge format
    if (raw?.edges) return raw.edges;
    // Consumet/flat array
    if (Array.isArray(raw)) return raw;
    return [];
  })();

  // --- Extract relations from /info response ---
  // AniList format: { relations: { edges: [{ node, relationType }] } }
  // Consumet flat:  { relations: [{ id, title, relationType, ... }] }
  const rels = (() => {
    const raw = anime?.relations;
    if (!raw) return [];
    if (raw?.edges) return raw.edges;
    if (Array.isArray(raw)) return raw;
    return [];
  })();

  // --- Extract recommendations from /info response ---
  // AniList format: { recommendations: { nodes: [{ mediaRecommendation }] } }
  // Consumet flat:  { recommendations: [{ id, title, ... }] }
  const recs = (() => {
    const raw = anime?.recommendations;
    if (!raw) return [];
    if (raw?.nodes) return raw.nodes;
    if (Array.isArray(raw)) return raw;
    return [];
  })();

  return (
    <div className="detail-page fade-in">
      {/* Back button — above hero overlap zone */}
      <div className="detail-back-bar">
        <button className="back-btn" onClick={onBack}>
          <IconBack size={14} color="currentColor" /> Back
        </button>
      </div>

      {/* Hero banner */}
      <div className="detail-hero">
        {(banner || img) && (
          <div className="detail-hero-bg" style={{ backgroundImage: `url(${banner || img})` }} />
        )}
        <div className="detail-hero-grad" />
      </div>

      <div className="detail-body">
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
                  // AniList edge: { node: { name, image }, role }
                  // Consumet flat: { id, name: { full } | string, image: string | { large }, role }
                  const ch   = c?.node || c;
                  const name = ch?.name?.full || ch?.name?.userPreferred ||
                               (typeof ch?.name === "string" ? ch.name : "") || "—";
                  const img  = ch?.image?.large || ch?.image?.medium ||
                               (typeof ch?.image === "string" ? ch.image : "") || "";
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
                  // AniList edge: { node: { id, title, ... }, relationType }
                  // Consumet flat: { id, title, relationType, ... }
                  const rel          = r?.node || r;
                  const relationType = r?.relationType || rel?.relationType;
                  if (!rel?.id) return null;
                  return (
                    <div key={i} style={{ position: "relative" }}>
                      {relationType && (
                        <div style={{
                          position: "absolute", top: 6, left: 6, zIndex: 2,
                          background: "rgba(0,0,0,0.75)", color: "var(--accent2)",
                          fontSize: "0.65rem", fontWeight: 700, padding: "2px 6px",
                          borderRadius: 4, textTransform: "uppercase",
                        }}>
                          {relationType}
                        </div>
                      )}
                      <AnimeCard anime={rel} onClick={() => {
                        setEpisode(null);
                        setActiveTab("episodes");
                        onRelated(rel.id);
                      }} />
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
                // AniList node: { mediaRecommendation: { id, title, ... } }
                // Consumet flat: { id, title, ... }
                const rec = r?.mediaRecommendation || r?.node?.mediaRecommendation || r?.media || r;
                if (!rec?.id) return null;
                return <AnimeCard key={i} anime={rec} onClick={() => {
                  setEpisode(null);
                  setActiveTab("episodes");
                  onRelated(rec.id);
                }} />;
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
