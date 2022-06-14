import { json } from "@remix-run/node";
import { handlePrismaClientError, prisma } from "~/db.server";
import { simulateSlowRequest } from "~/utils";

export let action = async ({ params, request }) => {
  await simulateSlowRequest();

  // TODO: Authenticate user
  let todoId = params.todoId;
  let formData = await request.formData();
  let completed = formData.get("completed");

  if (completed != null && completed !== "on") {
    throw json(
      `Invalid value for completed; value must be "on" or omitted from the request`,
      422
    );
  }

  try {
    let todo = await prisma.todo.update({
      where: { id: todoId },
      data: { completed: completed === "on" },
    });
    return json({ todo }, 200);
  } catch (fetchError) {
    if (fetchError instanceof Response) {
      throw fetchError;
    }

    let statusText = "There was an error updating the todo";
    handlePrismaClientError(fetchError, statusText);
    throw json(null, { status: 500, statusText });
  }
};
