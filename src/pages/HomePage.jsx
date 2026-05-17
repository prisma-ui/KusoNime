import SpotlightHero from "../components/SpotlightHero";
import AnimeRow from "../components/AnimeRow";

export default function HomePage({ onAnimeClick }) {
  return (
    <div className="fade-in">
      <SpotlightHero onAnimeClick={onAnimeClick} />
      <AnimeRow
        title="Trending Now"
        url="/trending?per_page=12"
        onAnimeClick={onAnimeClick}
      />
      <AnimeRow
        title="Currently Airing"
        url="/recent?per_page=12"
        onAnimeClick={onAnimeClick}
      />
      <AnimeRow
        title="Most Popular"
        url="/popular?per_page=12"
        onAnimeClick={onAnimeClick}
      />
      <AnimeRow
        title="Upcoming"
        url="/upcoming?per_page=12"
        onAnimeClick={onAnimeClick}
      />
      <div style={{ height: "2rem" }} />
    </div>
  );
}
