import { json } from "@remix-run/node";

export const loader = async ({ request }) => {
  // TODO: Implement loader
  return json(null, 501);
};

export const action = async ({ request }) => {
  // TODO: Implement action
  return json(null, 501);
};
