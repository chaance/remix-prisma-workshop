import { json } from "@remix-run/node";
import { prisma } from "~/db.server";

export let loader = async ({ params }) => {
  let todoId = params.todoId;
  try {
    let todo = await prisma.todo.findUnique({
      where: { id: todoId },
    });
    if (todo) {
      return json(todo, 200);
    }
    throw json(null, 404);
  } catch (fetchError) {
    if (fetchError instanceof Response) {
      throw fetchError;
    }
    throw json(null, {
      status: 500,
      statusText: "There was an error retrieving the todo",
    });
  }
};
