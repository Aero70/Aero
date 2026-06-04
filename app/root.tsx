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

import { createMeta } from "./utils/Meta"
import type { Route } from "./+types/root";
import { PageLayout } from "./components/PageLayout"

export const meta : MetaFunction = () => {
  return createMeta({
    title : "Aero — Developer",
    description:
      "On a journey to become a really good developer.",
    url: "https://Aero",
  })
}
import {
  createLogoBackgroundVariables,
} from "~/components/logo";

export const links: Route.LinksFunction = () => [
  {
    rel: "preload",
    href: "/font/Inter/inter.woff2",
    as: "font",
    type: "font/woff2",
    crossOrigin: "anonymous",
  },
  {
    rel: "preload",
    href: "/font/Mono/mono.woff2",
    as: "font",
    type: "font/woff2",
    crossOrigin: "anonymous",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
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
        style={createLogoBackgroundVariables({
          light: {
            color: "#e9e9e8",
          },
          dark: {
            color: "#151519",
          },
        })}
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
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
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
