import { json } from "@remix-run/node";
import type { ActionFunction } from "@remix-run/node";

export let action: ActionFunction = async () => {
  // TODO: Implement action
  return json(null, 501);
};
