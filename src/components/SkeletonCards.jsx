export default function SkeletonCards({ count = 8, grid = false }) {
  return (
    <div className={grid ? "anime-grid" : "scroll-row"} style={grid ? {} : { paddingBottom: "1rem" }}>
      {Array.from({ length: count }).map((_, i) => (
        grid ? (
          <div key={i} className="skeleton skeleton-card" />
        ) : (
          <div key={i} className="scroll-item">
            <div className="skeleton skeleton-card" />
          </div>
        )
      ))}
    </div>
  );
}
