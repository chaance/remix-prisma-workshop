import { json, redirect } from "@remix-run/node";
import type { ActionFunction } from "@remix-run/node";
import { prisma } from "~/db.server";
import { simulateSlowRequest } from "~/utils";

export let action: ActionFunction = async ({ params, request }) => {
  await simulateSlowRequest();

  let { projectId } = params;
  if (typeof projectId !== "string") {
    throw json(null, 404);
  }

  try {
    await prisma.project.delete({
      where: { id: projectId },
    });
    return redirect("/projects");
  } catch (fetchError) {
    throw json(null, {
      status: 500,
      statusText: "There was an error deleting the project",
    });
  }
};
