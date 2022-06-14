import { useMatches } from "@remix-run/react";
import { useMemo } from "react";

/**
 * This should be used any time the redirect path is user-provided (Like the
 * query string on our login/signup pages). This avoids open-redirect
 * vulnerabilities.
 *
 * @param {string} to The redirect destination
 * @param {string} defaultRedirect The redirect to use if the to is unsafe.
 */
export function safeRedirect(
  to: FormDataEntryValue | string | null | undefined,
  defaultRedirect: string = "/"
) {
  if (!to || typeof to !== "string") {
    return defaultRedirect;
  }
  if (!to.startsWith("/") || to.startsWith("//")) {
    return defaultRedirect;
  }
  return to;
}

/**
 * This base hook is used in other hooks to quickly search for specific data
 * across all loader data using useMatches.
 *
 * @param {string} id The route id
 * @returns {Record<string, unknown> | undefined} The router data or undefined if not found
 */
export function useMatchesData(
  id: string
): Record<string, unknown> | undefined {
  let matchingRoutes = useMatches();
  let route = useMemo(
    () => matchingRoutes.find((route) => route.id === id),
    [matchingRoutes, id]
  );
  return route?.data;
}

export function validateEmail(email: unknown): email is string {
  return typeof email === "string" && email.length > 3 && email.includes("@");
}

export async function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function simulateSlowRequest({
  max = 1600,
  min = 800,
}: {
  min?: number;
  max?: number;
} = {}) {
  await wait(Math.max(Math.round(Math.random() * max), min));
}
