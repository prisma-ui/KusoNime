import { useState } from "react";
import { useApi } from "../hooks/useApi";
import AnimeCard from "../components/AnimeCard";
import SkeletonCards from "../components/SkeletonCards";

const GENRES = [
  "Action","Adventure","Comedy","Drama","Fantasy","Horror",
  "Mystery","Romance","Sci-Fi","Slice of Life","Sports","Supernatural","Thriller",
];
const FORMATS  = ["TV","MOVIE","OVA","ONA","SPECIAL","MUSIC"];
const SEASONS  = ["WINTER","SPRING","SUMMER","FALL"];
const STATUSES = ["RELEASING","FINISHED","NOT_YET_RELEASED","CANCELLED"];
const SORTS    = ["TRENDING_DESC","POPULARITY_DESC","SCORE_DESC","START_DATE_DESC","UPDATED_AT_DESC"];

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 30 }, (_, i) => currentYear - i);

export default function BrowsePage({ onAnimeClick }) {
  const [activeTab, setActiveTab] = useState("trending");

  // Filter state
  const [genre,   setGenre]   = useState("");
  const [format,  setFormat]  = useState("");
  const [year,    setYear]    = useState("");
  const [season,  setSeason]  = useState("");
  const [status,  setStatus]  = useState("");
  const [sort,    setSort]    = useState("TRENDING_DESC");
  const [filterActive, setFilterActive] = useState(false);

  const tabs = [
    { id: "trending",  label: "Trending",  url: "/trending?per_page=24" },
    { id: "popular",   label: "Popular",   url: "/popular?per_page=24" },
    { id: "upcoming",  label: "Upcoming",  url: "/upcoming?per_page=24" },
    { id: "recent",    label: "Recent",    url: "/recent?per_page=24" },
    { id: "filter",    label: "Filter",    url: null },
  ];

  // Build filter URL
  const buildFilterUrl = () => {
    const params = new URLSearchParams();
    if (genre)  params.set("genre", genre);
    if (format) params.set("format", format);
    if (year)   params.set("year", year);
    if (season) params.set("season", season);
    if (status) params.set("status", status);
    if (sort)   params.set("sort", sort);
    params.set("per_page", "24");
    return `/filter?${params.toString()}`;
  };

  const cur = tabs.find((t) => t.id === activeTab);
  const apiUrl = activeTab === "filter"
    ? (filterActive ? buildFilterUrl() : null)
    : cur?.url;

  const { data, loading } = useApi(apiUrl, [apiUrl]);
  const list = data?.results || data?.data || (Array.isArray(data) ? data : []);

  return (
    <div className="fade-in">
      <div className="page-tabs">
        {tabs.map((t) => (
          <button
            key={t.id}
            className={`page-tab ${activeTab === t.id ? "active" : ""}`}
            onClick={() => { setActiveTab(t.id); setFilterActive(false); }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Filter UI */}
      {activeTab === "filter" && (
        <div style={{ padding: "1.2rem 2rem", display: "flex", flexWrap: "wrap", gap: "0.8rem", borderBottom: "1px solid var(--border)" }}>
          {/* Genre */}
          <select value={genre} onChange={e => setGenre(e.target.value)} className="filter-select">
            <option value="">Genre (semua)</option>
            {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
          {/* Format */}
          <select value={format} onChange={e => setFormat(e.target.value)} className="filter-select">
            <option value="">Format (semua)</option>
            {FORMATS.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
          {/* Year */}
          <select value={year} onChange={e => setYear(e.target.value)} className="filter-select">
            <option value="">Tahun (semua)</option>
            {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
          {/* Season */}
          <select value={season} onChange={e => setSeason(e.target.value)} className="filter-select">
            <option value="">Season (semua)</option>
            {SEASONS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          {/* Status */}
          <select value={status} onChange={e => setStatus(e.target.value)} className="filter-select">
            <option value="">Status (semua)</option>
            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          {/* Sort */}
          <select value={sort} onChange={e => setSort(e.target.value)} className="filter-select">
            {SORTS.map(s => <option key={s} value={s}>{s.replace(/_/g," ")}</option>)}
          </select>
          <button className="btn btn-primary" style={{ padding: "6px 18px" }} onClick={() => setFilterActive(true)}>
            Terapkan
          </button>
        </div>
      )}

      <div className="section">
        {loading && <SkeletonCards count={20} />}
        {!loading && activeTab === "filter" && !filterActive && (
          <div className="no-results">
            <p style={{ fontSize: "1.5rem" }}>🎯</p>
            <p>Atur filter lalu klik Terapkan</p>
          </div>
        )}
        {!loading && (filterActive || activeTab !== "filter") && list.length === 0 && (
          <div className="no-results"><p>Tidak ada hasil.</p></div>
        )}
        {!loading && list.length > 0 && (
          <div className="cards-row wide">
            {list.map((anime, i) => (
              <AnimeCard key={i} anime={anime} onClick={onAnimeClick} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
