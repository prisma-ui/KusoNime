export default function SkeletonCards({ count = 6 }) {
  return (
    <div className="cards-row">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton skeleton-card" />
      ))}
    </div>
  );
}
