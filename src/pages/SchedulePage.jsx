import { useApi } from "../hooks/useApi";
import { getImg, getTitle } from "../utils/helpers";
import { IconNoResults } from "../components/Icons";

const DAYS   = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const DAY_ID = ["Minggu","Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"];

function ScheduleCard({ anime, onClick }) {
  const img   = getImg(anime);
  const title = getTitle(anime);
  const ep    = anime?.nextAiringEpisode?.episode || anime?.episode;
  const time  = anime?.nextAiringEpisode?.airingAt
    ? new Date(anime.nextAiringEpisode.airingAt * 1000).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
    : anime?.airingTime || "";
  const score = anime?.averageScore || anime?.meanScore;

  return (
    <div className="sched-card" onClick={() => onClick(anime)}>
      <div className="sched-poster">
        {img
          ? <img src={img} alt={title} loading="lazy" />
          : <div className="sched-poster-placeholder" />
        }
        {ep && <div className="sched-ep-badge">Ep {ep}</div>}
      </div>
      <div className="sched-info">
        <div className="sched-title">{title}</div>
        <div className="sched-meta">
          {time && (
            <span className="sched-time">
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.4"/>
                <path d="M6 3V6.5L8 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
              </svg>
              {time}
            </span>
          )}
          {score && (
            <span className="sched-score">
              <svg width="10" height="10" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true">
                <path d="M7 1L8.545 5.09H13L9.5 7.545L10.91 12L7 9.36L3.09 12L4.5 7.545L1 5.09H5.455L7 1Z"/>
              </svg>
              {(score / 10).toFixed(1)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SchedulePage({ onAnimeClick }) {
  const { data, loading, error } = useApi("/schedule");
  const today = new Date().getDay();

  if (loading)
    return <div className="loading-full"><div className="spinner" /><p>Memuat jadwal...</p></div>;
  if (error || !data)
    return <div className="error-msg"><h3>Gagal memuat jadwal</h3></div>;

  const isWeekMap = data && typeof data === "object" && !Array.isArray(data) &&
    Object.keys(data).some(k => DAYS.map(d => d.toLowerCase()).includes(k.toLowerCase()));

  return (
    <div className="fade-in schedule-page">
      <div className="section-header" style={{ padding: "1.5rem 2rem 0" }}>
        <h2 className="section-title">Jadwal Tayang Mingguan</h2>
      </div>

      {isWeekMap ? (
        DAYS.map((day, di) => {
          const key  = Object.keys(data).find(k => k.toLowerCase() === day.toLowerCase());
          const list = key ? (data[key] || []) : [];
          const isToday = di === today;

          return (
            <div key={day} className="sched-day-section">
              <div className="sched-day-header">
                <div className={`sched-day-dot ${isToday ? "today" : ""}`} />
                <h3 className={`sched-day-label ${isToday ? "today" : ""}`}>
                  {DAY_ID[di]}
                  {isToday && <span className="sched-today-badge">Hari ini</span>}
                </h3>
                <span className="sched-count">{list.length} anime</span>
              </div>

              {list.length === 0 ? (
                <p className="sched-empty">Tidak ada jadwal</p>
              ) : (
                <div className="sched-grid">
                  {list.map((anime, i) => (
                    <ScheduleCard key={i} anime={anime} onClick={onAnimeClick} />
                  ))}
                </div>
              )}
            </div>
          );
        })
      ) : (
        // Fallback: flat list
        <div className="sched-day-section">
          <div className="sched-grid">
            {(Array.isArray(data) ? data : data?.results || []).map((anime, i) => (
              <ScheduleCard key={i} anime={anime} onClick={onAnimeClick} />
            ))}
          </div>
        </div>
      )}

      {isWeekMap && Object.values(data).every(v => !v?.length) && (
        <div className="no-results">
          <IconNoResults size={56} color="var(--muted2)" />
          <p>Jadwal tidak tersedia saat ini.</p>
        </div>
      )}
    </div>
  );
}
