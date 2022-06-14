import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { useRouteClassName } from "~/react-utils";
import stylesheetUrl from "./styles/app.css";

export const links = () => {
  return [{ rel: "stylesheet", href: stylesheetUrl }];
};

export const meta = () => {
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
        <header>
          <Link to="/">
            <h1>Project App</h1>
          </Link>
          <nav aria-label="Main">
            <Link to="/projects">Projects</Link>
          </nav>
        </header>
        <div>
          <Outlet />
        </div>
        <footer>&copy; TodoCompany</footer>

        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
