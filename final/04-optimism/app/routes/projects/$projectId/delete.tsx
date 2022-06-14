import { json } from "@remix-run/node";
import type { ActionFunction } from "@remix-run/node";
import { simulateSlowRequest } from "~/utils";

export let action: ActionFunction = async () => {
  await simulateSlowRequest();

  // TODO: Implement action
  return json(null, 501);
};
