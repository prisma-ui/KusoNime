import { IconBack } from "./Icons";

function IconNext({ size = 14, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M6 3L11 8L6 13" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * Pagination — tombol nomor halaman
 * Props:
 *   page        : halaman aktif (1-based)
 *   totalPages  : total halaman (boleh null/undefined jika tidak diketahui)
 *   hasNext     : apakah ada halaman berikutnya
 *   onChange    : (newPage) => void
 */
export default function Pagination({ page, totalPages, hasNext, onChange }) {
  if (!hasNext && page === 1) return null;

  // Buat rentang nomor halaman yang ditampilkan
  const buildRange = () => {
    if (!totalPages) {
      // Tidak tahu total — tampilkan window kecil di sekitar halaman aktif
      const pages = [];
      const start = Math.max(1, page - 2);
      const end   = hasNext ? page + 2 : page; // don't show pages beyond what exists
      for (let i = start; i <= end; i++) pages.push(i);
      return pages;
    }

    // Tahu total — tampilkan dengan ellipsis
    const delta = 2;
    const range = [];
    for (let i = Math.max(2, page - delta); i <= Math.min(totalPages - 1, page + delta); i++) {
      range.push(i);
    }

    const pages = [1];
    if (range[0] > 2) pages.push("...");
    pages.push(...range);
    if (range[range.length - 1] < totalPages - 1) pages.push("...");
    if (totalPages > 1) pages.push(totalPages);
    return pages;
  };

  const pages  = buildRange();
  const hasPrev = page > 1;

  const handleChange = (p) => {
    if (p === page || p === "...") return;
    onChange(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="pagination">
      {/* Prev */}
      <button
        className="pg-btn pg-arrow"
        disabled={!hasPrev}
        onClick={() => handleChange(page - 1)}
        aria-label="Halaman sebelumnya"
      >
        <IconBack size={14} color="currentColor" />
      </button>

      {/* Nomor halaman */}
      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`dots-${i}`} className="pg-dots">···</span>
        ) : (
          <button
            key={p}
            className={`pg-btn ${p === page ? "active" : ""}`}
            onClick={() => handleChange(p)}
            aria-current={p === page ? "page" : undefined}
          >
            {p}
          </button>
        )
      )}

      {/* Next */}
      <button
        className="pg-btn pg-arrow"
        disabled={!hasNext}
        onClick={() => handleChange(page + 1)}
        aria-label="Halaman berikutnya"
      >
        <IconNext size={14} color="currentColor" />
      </button>
    </div>
  );
}
