import { json } from "@remix-run/node";
import type { ActionFunction } from "@remix-run/node";
import { handlePrismaClientError, prisma } from "~/db.server";
import { simulateSlowRequest } from "~/utils";

export let action: ActionFunction = async ({ params, request }) => {
  await simulateSlowRequest();

  // TODO: Authenticate user
  let todoId = params.todoId!;
  try {
    await prisma.todo.delete({
      where: { id: todoId },
    });
    return json(null, 200);
  } catch (fetchError) {
    if (fetchError instanceof Response) {
      throw fetchError;
    }

    let statusText = "There was an error deleting the todo";
    handlePrismaClientError(fetchError, statusText);
    throw json(null, { status: 500, statusText });
  }
};
