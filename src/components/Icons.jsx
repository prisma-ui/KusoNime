/**
 * Icons.jsx — Semua ikon SVG AniStream di satu tempat
 * Gunakan: import { IconSearch, IconPlay, IconLogo } from "./Icons"
 */

export function IconLogo({ size = 28, color = "currentColor" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Layar / monitor */}
      <rect x="2" y="5" width="24" height="16" rx="3" fill={color} opacity="0.15" />
      <rect x="2" y="5" width="24" height="16" rx="3" stroke={color} strokeWidth="1.8" />
      {/* Segitiga play */}
      <path d="M11 10.5L18 13.5L11 16.5V10.5Z" fill={color} />
      {/* Kaki monitor */}
      <path d="M10 21H18M14 21V24" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function IconSearch({ size = 16, color = "currentColor" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="6.5" cy="6.5" r="4.5" stroke={color} strokeWidth="1.6" />
      <path d="M10 10L14 14" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function IconPlay({ size = 20, color = "currentColor" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M7 5.5L15 10L7 14.5V5.5Z" fill={color} />
    </svg>
  );
}

export function IconPlayCircle({ size = 44, color = "currentColor" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 44 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="22" cy="22" r="21" stroke={color} strokeWidth="1.5" fill="rgba(0,0,0,0.4)" />
      <path d="M17 15L31 22L17 29V15Z" fill={color} />
    </svg>
  );
}

export function IconInfo({ size = 16, color = "currentColor" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="8" cy="8" r="7" stroke={color} strokeWidth="1.5" />
      <path d="M8 7V11" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="8" cy="5" r="0.75" fill={color} />
    </svg>
  );
}

export function IconBack({ size = 16, color = "currentColor" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M10 3L5 8L10 13" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconStar({ size = 14, color = "currentColor" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 14 14"
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M7 1L8.545 5.09H13L9.5 7.545L10.91 12L7 9.36L3.09 12L4.5 7.545L1 5.09H5.455L7 1Z" />
    </svg>
  );
}

export function IconSearchEmpty({ size = 48, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="20" cy="20" r="13" stroke={color} strokeWidth="2.5" />
      <path d="M31 31L43 43" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M14 20H26M20 14V26" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function IconNoResults({ size = 48, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="20" cy="20" r="13" stroke={color} strokeWidth="2.5" />
      <path d="M31 31L43 43" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M15 16C15 16 17 14 20 14C23 14 25 16 25 16" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <path d="M15 23C16.5 25 18.5 26 20 26C21.5 26 23.5 25 25 23" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <circle cx="16" cy="20" r="1.2" fill={color} />
      <circle cx="24" cy="20" r="1.2" fill={color} />
    </svg>
  );
}

export function IconWarning({ size = 48, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M24 6L44 40H4L24 6Z" stroke={color} strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M24 20V29" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="24" cy="34.5" r="1.5" fill={color} />
    </svg>
  );
}

export function IconTv({ size = 48, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="4" y="8" width="40" height="26" rx="4" stroke={color} strokeWidth="2.5" />
      <path d="M16 40H32M24 34V40" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="24" cy="21" r="7" stroke={color} strokeWidth="2" />
      <path d="M21 19L28 21L21 23V19Z" fill={color} />
    </svg>
  );
}
