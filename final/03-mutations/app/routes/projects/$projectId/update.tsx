import { json } from "@remix-run/node";
import type { ActionFunction } from "@remix-run/node";
import { handlePrismaClientError, prisma } from "~/db.server";

export let action: ActionFunction = async ({ params, request }) => {
  // TODO: Authenticate user
  let projectId = params.projectId!;
  let formData = await request.formData();
  let name = formData.get("name");
  let description = formData.get("description");

  if (typeof name !== "string") {
    throw json(`Invalid value for name; expected a string`, 422);
  }
  if (name.length <= 0) {
    throw json(`Invalid value forname; expected a non-empty string`, 422);
  }
  if (description && typeof description !== "string") {
    throw json(`Invalid value for description; expected a string`, 422);
  }

  try {
    let project = await prisma.project.update({
      where: { id: projectId },
      data: { name, description: description || undefined },
    });
    return json({ project }, 200);
  } catch (fetchError) {
    if (fetchError instanceof Response) {
      throw fetchError;
    }

    let statusText = "There was an error updating the project";
    handlePrismaClientError(fetchError, statusText);
    throw json(null, { status: 500, statusText });
  }
};
