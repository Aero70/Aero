import {
  type MetaFunction,
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import "./app.css";
import { GlobalInitialRenderContext } from "./contexts/GlobalInitialRenderContext";
import { useIsInitialRender } from "./hooks/useIsInitialRender";
import { useLocation } from "react-router";

import { createMeta } from "./utils/Meta"
import { getBackgroundTheme } from "./data/themes"
import { PageLayout } from "./components/PageLayout"

import {
  createLogoBackgroundVariables,
} from "~/components/logo";
import type { Route } from "./+types/root";

const baseUrl = import.meta.env.BASE_URL;

export const meta : MetaFunction = () => {
  return createMeta({
    title : "Aero — Developer",
    description:
      "On a journey to become a really good developer.",
    url: "https://Aero",
  })
}


export const links: Route.LinksFunction = () => [
  {
    rel: "icon",
    href: `${baseUrl}favicon.svg`,
    type: "image/svg+xml",
  },
  {
    rel: "preload",
    href: `${baseUrl}font/Inter/inter.woff2`,
    as: "font",
    type: "font/woff2",
    crossOrigin: "anonymous",
  },
  {
    rel: "preload",
    href: `${baseUrl}font/Mono/mono.woff2`,
    as: "font",
    type: "font/woff2",
    crossOrigin: "anonymous",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const ThemeSwitching = getBackgroundTheme(location.pathname);
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          rel="alternate"
          type="application/rss+xml"
          title="Aero — Blog"
          href="/rss.xml"
        />
        <link
          rel="preload"
          href="/font/Inter/inter.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/font/Mono/mono.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <Meta />
        <Links /> 
      </head>
      <body className="bg-(image:--Aero-background-light) dark:bg-(image:--Aero-background-dark) bg-(--palette-light-grey) dark:bg-(--palette-dark-grey)"
        style={createLogoBackgroundVariables(ThemeSwitching)}
      >
        <GlobalInitialRenderContext.Provider value={useIsInitialRender()}>
          <PageLayout>{children}</PageLayout>
        </GlobalInitialRenderContext.Provider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const routeError: any = error;
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(routeError)) {
    message = routeError.status === 404 ? "404" : "Error";
    details =
      routeError.status === 404
        ? "The requested page could not be found."
        : routeError.statusText || details;
  } else if (routeError instanceof Error) {
    details = routeError.message;
    stack = import.meta.env.DEV ? routeError.stack : undefined;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
