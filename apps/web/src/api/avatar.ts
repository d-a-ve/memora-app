const AVATAR_COLORS = [
  "#5B8DEF",
  "#7C6CF0",
  "#E05A8C",
  "#E07A4F",
  "#D4A017",
  "#3FAE7A",
  "#2F9E9E",
  "#6B7C93",
] as const;

function colorForName(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) {
    hash = (hash * 31 + name.charCodeAt(i)) | 0;
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

/** Drop-in for Appwrite `avatar.getInitials()` — returns `{ href }` for <img src>. */
export function getInitials(name?: string) {
  const trimmed = (name ?? "").trim();
  const parts = trimmed.split(/\s+/).filter(Boolean);
  const initials =
    parts
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("") || "?";

  const background = colorForName(trimmed || "?");

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128">
  <rect width="128" height="128" fill="${background}"/>
  <text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" font-family="system-ui,sans-serif" font-size="52" font-weight="600" fill="#ffffff">${initials}</text>
</svg>`;

  return {
    href: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`,
  };
}
