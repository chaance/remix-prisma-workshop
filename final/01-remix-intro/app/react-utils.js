import { useLocation } from "@remix-run/react";

export function useRouteClassName() {
  let location = useLocation();
  let routeClassName = "app";
  switch (location.pathname) {
    case "/":
      routeClassName = "home-route";
      break;
    case "/projects":
      routeClassName = "projects-route";
      break;
    case "/projects/create":
      routeClassName = "create-project-route";
      break;
    default: {
      if (location.pathname.match(/^\/projects\/([a-zA-Z0-9\-_]+)$/)) {
        routeClassName = "project-route";
      }
      break;
    }
  }
  return routeClassName;
}
