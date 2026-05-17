import { useApi } from "../hooks/useApi";
import AnimeCard from "./AnimeCard";
import SkeletonCards from "./SkeletonCards";

export default function AnimeRow({ title, url, onAnimeClick, wide }) {
  const { data, loading, error } = useApi(url);
  const list = data?.results || data?.data || (Array.isArray(data) ? data : []);

  return (
    <div className="section">
      <div className="section-header">
        <h2 className="section-title">{title}</h2>
      </div>
      {loading && <SkeletonCards count={8} />}
      {error && (
        <div className="error-msg">
          <p>Failed to load. Please retry.</p>
        </div>
      )}
      {!loading && !error && (
        <div className="scroll-row">
          {list.map((anime, i) => (
            <div key={i} className={`scroll-item ${wide ? "wide" : ""}`}>
              <AnimeCard anime={anime} onClick={onAnimeClick} wide={wide} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
