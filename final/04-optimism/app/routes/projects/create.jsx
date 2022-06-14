import * as React from "react";
import { Form, useTransition } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import { handlePrismaClientError, prisma } from "~/db.server";
import { simulateSlowRequest } from "~/utils";

export let action = async ({ request }) => {
  await simulateSlowRequest();

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
  let transition = useTransition();
  let isBusy =
    transition.state === "submitting" ||
    (transition.type === "actionRedirect" && transition.state === "loading");
  return (
    <main>
      <h1>Create a Project</h1>
      <Form method="post">
        <label>
          <span>Project Name</span>
          <input type="text" name="name" required min={1} disabled={isBusy} />
        </label>
        <label>
          <span>Project Description</span>
          <textarea name="description" disabled={isBusy} />
        </label>
        <button className="button" disabled={isBusy}>
          Create
        </button>
      </Form>
    </main>
  );
}
