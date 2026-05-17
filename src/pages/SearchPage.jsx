import { useState, useEffect } from "react";
import { useApi } from "../hooks/useApi";
import AnimeCard from "../components/AnimeCard";
import SkeletonCards from "../components/SkeletonCards";
import Pagination from "../components/Pagination";
import { IconSearchEmpty, IconNoResults } from "../components/Icons";

const PER_PAGE = 24;

export default function SearchPage({ query, onAnimeClick }) {
  const [page, setPage] = useState(1);

  // Reset to page 1 whenever the query changes
  useEffect(() => {
    setPage(1);
  }, [query]);

  const encoded = encodeURIComponent(query);
  const { data, loading } = useApi(
    query ? `/search?query=${encoded}&per_page=${PER_PAGE}&page=${page}` : null,
    [query, page]
  );

  const list       = data?.results || data?.data || [];
  const totalPages = data?.totalPages || data?.lastPage || null;
  const hasNext    = data?.hasNextPage ?? (list.length === PER_PAGE);

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
        {totalPages && <span className="search-page-info"> — halaman {page} dari {totalPages}</span>}
      </h2>

      {loading && <SkeletonCards count={PER_PAGE} grid />}

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

      <Pagination
        page={page}
        totalPages={totalPages}
        hasNext={hasNext}
        onChange={(p) => setPage(p)}
      />
    </div>
  );
}
