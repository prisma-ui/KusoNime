import { useApi } from "../hooks/useApi";
import AnimeCard from "../components/AnimeCard";
import SkeletonCards from "../components/SkeletonCards";

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
        <p style={{ fontSize: "2rem" }}>🔍</p>
        <p>Type something to search anime...</p>
      </div>
    );

  return (
    <div className="search-page fade-in">
      <h2 className="search-title">
        Results for &quot;<span>{query}</span>&quot;
      </h2>
      {loading && <SkeletonCards count={12} />}
      {!loading && list.length === 0 && (
        <div className="no-results">
          <p style={{ fontSize: "2rem" }}>😢</p>
          <p>No anime found for &quot;{query}&quot;</p>
        </div>
      )}
      {!loading && (
        <div className="cards-row wide">
          {list.map((anime, i) => (
            <AnimeCard key={i} anime={anime} onClick={onAnimeClick} />
          ))}
        </div>
      )}
    </div>
  );
}
