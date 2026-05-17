import { useState, useRef } from "react";
import { API_BASE, SEARCH_SUGGESTIONS, SEARCH_DEBOUNCE } from "../utils/constants";
import { getImg, getTitle } from "../utils/helpers";
import { IconSearch } from "./Icons";

export default function SearchBar({ onSearch }) {
  const [q, setQ] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSug, setShowSug] = useState(false);
  const debRef = useRef(null);

  const handleChange = (val) => {
    setQ(val);
    clearTimeout(debRef.current);
    if (val.length < 2) {
      setSuggestions([]);
      return;
    }
    debRef.current = setTimeout(() => {
      fetch(`${API_BASE}/suggestions?query=${encodeURIComponent(val)}`)
        .then((r) => r.json())
        .then((d) =>
          setSuggestions((d?.results || d?.data || d || []).slice(0, SEARCH_SUGGESTIONS))
        )
        .catch(() => {});
    }, SEARCH_DEBOUNCE);
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && q.trim()) {
      onSearch(q.trim());
      setShowSug(false);
    }
  };

  const pick = (title) => {
    setQ(title);
    setSuggestions([]);
    onSearch(title);
  };

  return (
    <div style={{ position: "relative" }}>
      <div className="nav-search">
        <span className="search-icon">
          <IconSearch size={15} color="var(--muted)" />
        </span>
        <input
          value={q}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={handleKey}
          onFocus={() => setShowSug(true)}
          onBlur={() => setTimeout(() => setShowSug(false), 180)}
          placeholder="Search anime..."
        />
      </div>
      {showSug && suggestions.length > 0 && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            right: 0,
            width: "100%",
            minWidth: 260,
            background: "var(--bg3)",
            border: "1px solid var(--border2)",
            borderRadius: "var(--radius2)",
            overflow: "hidden",
            zIndex: 200,
            boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
          }}
        >
          {suggestions.map((s, i) => {
            const t =
              getTitle(s) || s?.title || (typeof s === "string" ? s : "");
            const img = getImg(s);
            return (
              <div
                key={i}
                onMouseDown={() => pick(t)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "8px 12px",
                  cursor: "pointer",
                  transition: "background 0.15s",
                  borderBottom:
                    i < suggestions.length - 1
                      ? "1px solid var(--border)"
                      : "none",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "var(--surface)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "")
                }
              >
                {img && (
                  <img
                    src={img}
                    alt=""
                    style={{
                      width: 32,
                      height: 44,
                      objectFit: "cover",
                      borderRadius: 4,
                      flexShrink: 0,
                    }}
                  />
                )}
                <div>
                  <div style={{ fontSize: "0.82rem", fontWeight: 500 }}>
                    {t}
                  </div>
                  {s?.format && (
                    <div style={{ fontSize: "0.7rem", color: "var(--muted2)" }}>
                      {s.format} {s?.seasonYear ? `· ${s.seasonYear}` : ""}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
