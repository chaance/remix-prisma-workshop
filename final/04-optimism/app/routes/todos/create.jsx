import { json } from "@remix-run/node";
import { handlePrismaClientError, prisma } from "~/db.server";
import { simulateSlowRequest } from "~/utils";

export let action = async ({ request }) => {
  await simulateSlowRequest();

  // TODO: Authenticate user
  let formData = await request.formData();
  let projectId = formData.get("projectId");
  let name = formData.get("name");

  validateTextField("projectId", projectId);
  validateTextField("name", name);

  try {
    let todo = await prisma.todo.create({
      data: {
        name,
        projectId,
      },
    });
    return json({ todo }, 200);
  } catch (fetchError) {
    if (fetchError instanceof Response) {
      throw fetchError;
    }

    let statusText = "There was an error creating the todo";
    handlePrismaClientError(fetchError, statusText);
    throw json(null, { status: 500, statusText });
  }
};

function validateTextField(fieldName, input) {
  if (typeof input !== "string") {
    throw json(`Invalid value for ${fieldName}; expected a string`, 422);
  }
  if (input.length <= 0) {
    throw json(
      `Invalid value for ${fieldName}; expected a non-empty string`,
      422
    );
  }
}
