import * as React from "react";
import { Form } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import { handlePrismaClientError, prisma } from "~/db.server";

export let action = async ({ request }) => {
  // TODO: Authenticate user
  let formData = await request.formData();
  let name = formData.get("name");
  let description = formData.get("description");

  if (typeof name !== "string") {
    throw json(null, {
      statusText: "Invalid value for name; expected a string",
      status: 422,
    });
  }
  if (name.length <= 0) {
    throw json(null, {
      statusText: "Invalid value for name; expected a non-empty string",
      status: 422,
    });
  }
  if (description && typeof description !== "string") {
    throw json(null, {
      statusText: "Invalid value for description; expected a string",
      status: 422,
    });
  }

  let user;
  let project;
  try {
    user = await prisma.user.findFirst();
  } catch (err) {
    throw json(null, {
      status: 500,
      statusText: "`There was an error fetching the user`",
    });
  }

  if (!user) {
    throw Error(
      "No user found, crash the app because you need to run the DB seed script!"
    );
  }

  try {
    project = await prisma.project.create({
      data: {
        name,
        description: description || "",
        userId: user.id,
      },
    });
  } catch (fetchError) {
    let statusText = "There was an error creating the project";
    handlePrismaClientError(fetchError, statusText);
    throw json(null, {
      status: 500,
      statusText,
    });
  }
  return redirect(`/projects/${project.id}`);
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
