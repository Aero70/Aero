
const backgroundThemes = {
    default: {
        light: { color: "#e9e9e8" },
        dark: { color: "#151519" },
    },
    games: {
        light: { color: "#e9e9e8" },
        dark: { color: "#151519" },
    },
};

const routeBackgroundThemeMap = [
    {
        match: (pathname: string) => pathname.startsWith("/games"),
        theme: "games",
    },
] as const;

export function getBackgroundTheme(pathname: string) {
  const matched = routeBackgroundThemeMap.find((item) =>
    item.match(pathname)
  );

  return backgroundThemes[matched?.theme ?? "default"];
}