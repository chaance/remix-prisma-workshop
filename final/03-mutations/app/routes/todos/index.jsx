import { json } from "@remix-run/node";

export let loader = async () => {
  // TODO: Implement loader
  return json(null, 501);
};
