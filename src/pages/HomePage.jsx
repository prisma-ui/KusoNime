import SpotlightHero from "../components/SpotlightHero";
import AnimeRow from "../components/AnimeRow";
import AnimeGrid from "../components/AnimeGrid";

export default function HomePage({ onAnimeClick }) {
  return (
    <div className="fade-in">
      <SpotlightHero onAnimeClick={onAnimeClick} />
      <AnimeRow
        title="Trending Now"
        url="/trending?per_page=12"
        onAnimeClick={onAnimeClick}
      />
      {/* Recently Updated - tampil sebagai GRID */}
      <AnimeGrid
        title="Recently Updated"
        url="/recent?per_page=16"
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
