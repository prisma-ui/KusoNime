import { getImg, getTitle } from "../utils/helpers";
import { IconPlayCircle, IconStar } from "./Icons";

export default function AnimeCard({ anime, onClick }) {
  const img = getImg(anime);
  const title = getTitle(anime);
  const score = anime?.averageScore || anime?.meanScore;
  const eps = anime?.episodes;
  const format = anime?.format;

  return (
    <div className="anime-card" onClick={() => onClick(anime)}>
      <div className="card-poster">
        {img ? (
          <img src={img} alt={title} loading="lazy" />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              background: "var(--surface)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--muted2)",
              fontSize: "0.75rem",
            }}
          >
            No image
          </div>
        )}
        <div className="card-overlay">
          <div className="play-btn">
            <IconPlayCircle size={44} color="white" />
          </div>
        </div>
        {format && <div className="card-badge">{format}</div>}
        {score && (
          <div className="card-score">
            <IconStar size={11} color="var(--accent2)" />
            {" "}{(score / 10).toFixed(1)}
          </div>
        )}
        {eps && <div className="card-eps">{eps} eps</div>}
      </div>
      <div className="card-info">
        <div className="card-title">{title}</div>
        <div className="card-meta">
          {anime?.season && <span>{anime.season}</span>}
          {anime?.seasonYear && <span>{anime.seasonYear}</span>}
          {anime?.status && (
            <span
              style={{
                color:
                  anime.status === "RELEASING" ? "#34d399" : "var(--muted2)",
              }}
            >
              {anime.status === "RELEASING" ? "Airing" : anime.status}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
