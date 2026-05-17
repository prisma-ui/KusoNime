import { useApi } from "../hooks/useApi";
import AnimeCard from "../components/AnimeCard";
import SkeletonCards from "../components/SkeletonCards";
import { IconSearchEmpty, IconNoResults } from "../components/Icons";

export default function SearchPage({ query, onAnimeClick }) {
  const encoded = encodeURIComponent(query);
  const { data, loading } = useApi(
    query ? `/search?query=${encoded}&per_page=24` : null,
    [query]
  );
  const list = data?.results || data?.data || [];

  if (!query)
    return (
      <div className="no-results">
        <IconSearchEmpty size={56} color="var(--muted2)" />
        <p>Ketik sesuatu untuk mencari anime...</p>
      </div>
    );

  return (
    <div className="search-page fade-in">
      <h2 className="search-title">
        Results for &quot;<span>{query}</span>&quot;
      </h2>
      {loading && <SkeletonCards count={12} grid />}
      {!loading && list.length === 0 && (
        <div className="no-results">
          <IconNoResults size={56} color="var(--muted2)" />
          <p>Tidak ada anime ditemukan untuk &quot;{query}&quot;</p>
        </div>
      )}
      {!loading && list.length > 0 && (
        <div className="anime-grid">
          {list.map((anime, i) => (
            <AnimeCard key={i} anime={anime} onClick={onAnimeClick} />
          ))}
        </div>
      )}
    </div>
  );
}
