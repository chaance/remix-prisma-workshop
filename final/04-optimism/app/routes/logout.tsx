import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";

export const loader: LoaderFunction = async ({ request }) => {
  // TODO: Implement loader
  return json(null, 501);
};

export const action: ActionFunction = async ({ request }) => {
  // TODO: Implement action
  return json(null, 501);
};
