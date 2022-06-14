import { json } from "@remix-run/node";
import { simulateSlowRequest } from "~/utils";

export let action = async () => {
  await simulateSlowRequest();

  // TODO: Implement action
  return json(null, 501);
};
