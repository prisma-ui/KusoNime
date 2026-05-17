import { useState, useEffect, useRef } from "react";
import { useApi } from "../hooks/useApi";
import { getBanner, getImg, getTitle, getRomaji, cleanHtml } from "../utils/helpers";
import { IconPlay, IconInfo, IconStar } from "./Icons";
import { SPOTLIGHT_COUNT, SPOTLIGHT_INTERVAL } from "../utils/constants";

export default function SpotlightHero({ onAnimeClick }) {
  const { data, loading } = useApi("/spotlight");
  const [idx, setIdx] = useState(0);
  const timerRef = useRef(null);

  const list = data?.results || data?.data || [];
  const anime = list[idx];

  useEffect(() => {
    if (list.length < 2) return;
    timerRef.current = setInterval(() => {
      setIdx((i) => (i + 1) % Math.min(list.length, SPOTLIGHT_COUNT));
    }, SPOTLIGHT_INTERVAL);
    return () => clearInterval(timerRef.current);
  }, [list.length]);

  if (loading)
    return (
      <div
        style={{
          height: 500,
          background: "var(--bg2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className="spinner" style={{ width: 50, height: 50 }} />
      </div>
    );
  if (!anime) return null;

  const banner = getBanner(anime);
  const title = getTitle(anime);
  const score = anime?.averageScore || anime?.meanScore;

  return (
    <div className="hero spotlight-carousel">
      <div
        className="hero-bg"
        style={{ backgroundImage: `url(${banner || getImg(anime)})` }}
      />
      <div className="hero-gradient" />
      <div className="hero-side-gradient" />
      <div className="hero-content fade-in" key={idx}>
        <div className="hero-badges">
          {anime?.format && (
            <span className="hero-badge">{anime.format}</span>
          )}
          {score && (
            <span className="hero-badge">
              <IconStar size={11} color="var(--accent2)" />
              {" "}{(score / 10).toFixed(1)}
            </span>
          )}
          {anime?.status === "RELEASING" && (
            <span className="hero-badge">Airing</span>
          )}
          {anime?.episodes && (
            <span className="hero-badge ep">{anime.episodes} eps</span>
          )}
        </div>
        <h1 className="hero-title">{title}</h1>
        {getRomaji(anime) !== title && (
          <p
            style={{
              color: "var(--muted)",
              fontSize: "0.9rem",
              marginBottom: "0.6rem",
              fontStyle: "italic",
            }}
          >
            {getRomaji(anime)}
          </p>
        )}
        <p className="hero-desc">{cleanHtml(anime?.description)}</p>
        <div className="hero-actions">
          <button
            className="btn btn-primary"
            onClick={() => onAnimeClick(anime)}
          >
            <IconPlay size={18} color="white" />
            Watch Now
          </button>
          <button
            className="btn btn-ghost"
            onClick={() => onAnimeClick(anime)}
          >
            <IconInfo size={15} color="currentColor" />
            Details
          </button>
        </div>
        <div className="hero-dots">
          {Array.from({ length: Math.min(list.length, SPOTLIGHT_COUNT) }).map((_, i) => (
            <div
              key={i}
              className={`hero-dot ${i === idx ? "active" : ""}`}
              onClick={() => {
                setIdx(i);
                clearInterval(timerRef.current);
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
