import { json } from "@remix-run/node";
import type { LoaderFunction } from "@remix-run/node";

export let loader: LoaderFunction = async () => {
  // TODO: Implement loader
  return json(null, 501);
};
