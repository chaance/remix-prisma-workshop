import * as React from "react";
import { Form } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import type { ActionFunction } from "@remix-run/node";
import { handlePrismaClientError, prisma } from "~/db.server";

export let action: ActionFunction = async ({ request }) => {
  // TODO: Authenticate user
  let formData = await request.formData();
  let name = formData.get("name");
  let description = formData.get("description");

  if (typeof name !== "string") {
    throw json(`Invalid value for name; expected a string`, 422);
  }
  if (name.length <= 0) {
    throw json(`Invalid value for name; expected a non-empty string`, 422);
  }
  if (description && typeof description !== "string") {
    throw json(`Invalid value for ${description}; expected a string`, 422);
  }

  try {
    // TODO: Implement when we have auth setup
    let user = await prisma.user.findFirst();
    if (!user) {
      throw Error(
        "No user found. Run the prisma seed script first before attempting to use the database."
      );
    }

    let project = await prisma.project.create({
      data: {
        name,
        description: description || "",
        userId: user.id,
      },
    });
    return redirect(`/projects/${project.id}`);
  } catch (fetchError) {
    if (fetchError instanceof Response) {
      throw fetchError;
    }
    let statusText = "There was an error creating the project";
    handlePrismaClientError(fetchError, statusText);
    throw json(null, { status: 500, statusText });
  }
};

export default function CreateProjectRoute() {
  return (
    <main>
      <h1>Create a Project</h1>
      <Form method="post">
        <label>
          <span>Project Name</span>
          <input type="text" name="name" required min={1} />
        </label>
        <label>
          <span>Project Description</span>
          <textarea name="description" />
        </label>
        <button className="button">Create</button>
      </Form>
    </main>
  );
}
