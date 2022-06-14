import type { LinksFunction, MetaFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { useRouteClassName } from "~/react-utils";
import stylesheetUrl from "./styles/app.css";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesheetUrl }];
};

export const meta: MetaFunction = () => {
  return {
    charset: "utf-8",
    title: "Remix Notes",
    viewport: "width=device-width,initial-scale=1",
  };
};

export default function App() {
  let routeClassName = useRouteClassName();
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body className={routeClassName}>
        <div>
          <Outlet />
        </div>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
