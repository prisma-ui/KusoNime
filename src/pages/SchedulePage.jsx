import { useApi } from "../hooks/useApi";
import { getImg, getTitle } from "../utils/helpers";

const DAYS = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const DAY_ID = ["Minggu","Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"];

export default function SchedulePage({ onAnimeClick }) {
  const { data, loading, error } = useApi("/schedule");
  const today = new Date().getDay(); // 0=Sun

  if (loading)
    return <div className="loading-full"><div className="spinner" /><p>Memuat jadwal...</p></div>;
  if (error || !data)
    return <div className="error-msg"><h3>Gagal memuat jadwal</h3></div>;

  // data bisa berupa { monday: [...], ... } atau { results: [...] } atau array
  const isWeekMap = data && typeof data === "object" && !Array.isArray(data) &&
    Object.keys(data).some(k => DAYS.map(d => d.toLowerCase()).includes(k.toLowerCase()));

  return (
    <div className="fade-in" style={{ padding: "1.5rem 2rem 2rem" }}>
      <h2 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "1.5rem" }}>
        Jadwal Tayang Mingguan
      </h2>
      {isWeekMap ? (
        DAYS.map((day, di) => {
          const key = Object.keys(data).find(k => k.toLowerCase() === day.toLowerCase());
          const list = key ? (data[key] || []) : [];
          const isToday = di === today;
          return (
            <div key={day} style={{ marginBottom: "2rem" }}>
              <div style={{
                display: "flex", alignItems: "center", gap: 10,
                marginBottom: "0.8rem",
              }}>
                <div style={{
                  width: 8, height: 8, borderRadius: "50%",
                  background: isToday ? "var(--accent)" : "var(--border2)",
                }} />
                <h3 style={{
                  fontSize: "0.95rem", fontWeight: 600,
                  color: isToday ? "var(--accent)" : "var(--text)",
                }}>
                  {DAY_ID[di]}{isToday ? " — Hari ini" : ""}
                </h3>
                <span style={{ fontSize: "0.75rem", color: "var(--muted2)" }}>
                  {list.length} anime
                </span>
              </div>
              {list.length === 0 ? (
                <p style={{ color: "var(--muted2)", fontSize: "0.82rem" }}>Tidak ada jadwal</p>
              ) : (
                <div className="schedule-row">
                  {list.map((anime, i) => {
                    const img   = getImg(anime);
                    const title = getTitle(anime);
                    const ep    = anime?.nextAiringEpisode?.episode || anime?.episode;
                    const time  = anime?.nextAiringEpisode?.airingAt
                      ? new Date(anime.nextAiringEpisode.airingAt * 1000).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
                      : anime?.airingTime || "";
                    return (
                      <div key={i} className="schedule-card" onClick={() => onAnimeClick(anime)}>
                        {img && <img src={img} alt={title} loading="lazy" />}
                        <div className="schedule-info">
                          <div className="schedule-title">{title}</div>
                          <div className="schedule-meta">
                            {ep && <span>Ep {ep}</span>}
                            {time && <span>{time}</span>}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })
      ) : (
        // Fallback: render as flat list
        <div className="cards-row wide">
          {(Array.isArray(data) ? data : data?.results || []).map((anime, i) => {
            const img   = getImg(anime);
            const title = getTitle(anime);
            return (
              <div key={i} className="schedule-card" onClick={() => onAnimeClick(anime)}>
                {img && <img src={img} alt={title} loading="lazy" />}
                <div className="schedule-info">
                  <div className="schedule-title">{title}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
