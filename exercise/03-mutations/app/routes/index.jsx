import { redirect } from "@remix-run/node";

export const loader = async (args) => {
  return redirect("/projects");
};
