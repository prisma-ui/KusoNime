import { useState } from "react";
import { useApi } from "../hooks/useApi";
import AnimeCard from "../components/AnimeCard";
import SkeletonCards from "../components/SkeletonCards";
import Pagination from "../components/Pagination";
import { IconNoResults } from "../components/Icons";

const GENRES   = ["Action","Adventure","Comedy","Drama","Fantasy","Horror","Mystery","Romance","Sci-Fi","Slice of Life","Sports","Supernatural","Thriller"];
const FORMATS  = ["TV","MOVIE","OVA","ONA","SPECIAL","MUSIC"];
const SEASONS  = ["WINTER","SPRING","SUMMER","FALL"];
const STATUSES = ["RELEASING","FINISHED","NOT_YET_RELEASED","CANCELLED"];
const SORTS    = ["TRENDING_DESC","POPULARITY_DESC","SCORE_DESC","START_DATE_DESC","UPDATED_AT_DESC"];
const PER_PAGE = 24;

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 30 }, (_, i) => currentYear - i);

function IconFilter({ size = 14, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M2 4H14M4 8H12M6 12H10" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export default function BrowsePage({ onAnimeClick }) {
  const [activeTab, setActiveTab] = useState("trending");
  const [page, setPage] = useState(1);

  // Filter state
  const [genre,        setGenre]        = useState("");
  const [format,       setFormat]       = useState("");
  const [year,         setYear]         = useState("");
  const [season,       setSeason]       = useState("");
  const [status,       setStatus]       = useState("");
  const [sort,         setSort]         = useState("TRENDING_DESC");
  const [filterActive, setFilterActive] = useState(false);

  const tabs = [
    { id: "trending", label: "Trending",  url: `/trending?per_page=${PER_PAGE}` },
    { id: "popular",  label: "Popular",   url: `/popular?per_page=${PER_PAGE}` },
    { id: "upcoming", label: "Upcoming",  url: `/upcoming?per_page=${PER_PAGE}` },
    { id: "recent",   label: "Recent",    url: `/recent?per_page=${PER_PAGE}` },
    { id: "filter",   label: "Filter",    url: null },
  ];

  const buildFilterUrl = () => {
    const params = new URLSearchParams();
    if (genre)  params.set("genre", genre);
    if (format) params.set("format", format);
    if (year)   params.set("year", year);
    if (season) params.set("season", season);
    if (status) params.set("status", status);
    if (sort)   params.set("sort", sort);
    params.set("per_page", PER_PAGE);
    params.set("page", page);
    return `/filter?${params.toString()}`;
  };

  const switchTab = (id) => {
    if (id === activeTab) return;
    setActiveTab(id);
    setPage(1);
    setFilterActive(false);
  };

  const cur    = tabs.find((t) => t.id === activeTab);
  const apiUrl = activeTab === "filter"
    ? (filterActive ? buildFilterUrl() : null)
    : cur?.url ? `${cur.url}&page=${page}` : null;

  const { data, loading } = useApi(apiUrl, [apiUrl]);
  const list       = data?.results || data?.data || (Array.isArray(data) ? data : []);
  const totalPages = data?.totalPages || data?.lastPage || null;
  const hasNext    = data?.hasNextPage ?? (list.length === PER_PAGE);

  return (
    <div className="fade-in">
      <div className="page-tabs">
        {tabs.map((t) => (
          <button
            key={t.id}
            className={`page-tab ${activeTab === t.id ? "active" : ""}`}
            onClick={() => switchTab(t.id)}
          >
            {t.id === "filter" && <IconFilter size={13} color="currentColor" />}
            {" "}{t.label}
          </button>
        ))}
      </div>

      {/* Filter UI */}
      {activeTab === "filter" && (
        <div className="filter-bar">
          <select value={genre}  onChange={e => { setGenre(e.target.value);  setPage(1); }} className="filter-select">
            <option value="">Genre (semua)</option>
            {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
          <select value={format} onChange={e => { setFormat(e.target.value); setPage(1); }} className="filter-select">
            <option value="">Format (semua)</option>
            {FORMATS.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
          <select value={year}   onChange={e => { setYear(e.target.value);   setPage(1); }} className="filter-select">
            <option value="">Tahun (semua)</option>
            {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
          <select value={season} onChange={e => { setSeason(e.target.value); setPage(1); }} className="filter-select">
            <option value="">Season (semua)</option>
            {SEASONS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={status} onChange={e => { setStatus(e.target.value); setPage(1); }} className="filter-select">
            <option value="">Status (semua)</option>
            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={sort}   onChange={e => { setSort(e.target.value);   setPage(1); }} className="filter-select">
            {SORTS.map(s => <option key={s} value={s}>{s.replace(/_/g," ")}</option>)}
          </select>
          <button
            className="btn btn-primary"
            style={{ padding: "6px 18px", flexShrink: 0 }}
            onClick={() => { setPage(1); setFilterActive(true); }}
          >
            Terapkan
          </button>
        </div>
      )}

      <div className="section">
        {loading && <SkeletonCards count={PER_PAGE} grid />}

        {!loading && activeTab === "filter" && !filterActive && (
          <div className="no-results">
            <IconFilter size={48} color="var(--muted2)" />
            <p>Atur filter lalu klik Terapkan</p>
          </div>
        )}

        {!loading && (filterActive || activeTab !== "filter") && list.length === 0 && (
          <div className="no-results">
            <IconNoResults size={56} color="var(--muted2)" />
            <p>Tidak ada hasil.</p>
          </div>
        )}

        {!loading && list.length > 0 && (
          <div className="anime-grid">
            {list.map((anime, i) => (
              <AnimeCard key={i} anime={anime} onClick={onAnimeClick} />
            ))}
          </div>
        )}

        <Pagination
          page={page}
          totalPages={totalPages}
          hasNext={hasNext}
          onChange={(p) => setPage(p)}
        />
      </div>
    </div>
  );
}
