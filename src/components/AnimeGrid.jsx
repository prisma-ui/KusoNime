import { useApi } from "../hooks/useApi";
import AnimeCard from "./AnimeCard";
import SkeletonCards from "./SkeletonCards";

export default function AnimeGrid({ title, url, onAnimeClick }) {
  const { data, loading, error } = useApi(url);
  const list = data?.results || data?.data || (Array.isArray(data) ? data : []);

  return (
    <div className="section">
      <div className="section-header">
        <h2 className="section-title">{title}</h2>
      </div>
      {loading && <SkeletonCards count={8} grid />}
      {error && (
        <div className="error-msg">
          <p>Failed to load. Please retry.</p>
        </div>
      )}
      {!loading && !error && (
        <div className="anime-grid">
          {list.map((anime, i) => (
            <AnimeCard key={i} anime={anime} onClick={onAnimeClick} />
          ))}
        </div>
      )}
    </div>
  );
}
