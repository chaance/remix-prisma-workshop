import * as React from "react";
import { json } from "@remix-run/node";
import type { LoaderFunction } from "@remix-run/node";
import { useCatch, useLoaderData } from "@remix-run/react";
import { prisma } from "~/db.server";
import type { Project } from "~/types";

export let loader: LoaderFunction = async (args) => {
  let { projectId } = args.params;
  if (!isValidProjectId(projectId)) {
    throw json(null, 404);
  }

  try {
    let project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { todos: true },
    });
    if (!project) {
      throw json(null, 404);
    }
    return json<LoaderData>({ project }, 200);
  } catch (fetchError) {
    if (fetchError instanceof Response) {
      throw fetchError;
    }
    throw json(null, {
      status: 500,
      statusText: "There was an error fetching the project",
    });
  }
};

export default function ProjectRoute() {
  let { project } = useLoaderData<LoaderData>();

  return (
    <main>
      <header>
        <h1>{project.name}</h1>
        <p>{project.description}</p>
      </header>
      <hr />
      <section>
        <h2>Tasks</h2>
        {project.todos.length > 0 ? (
          <ul className="todo-list">
            {project.todos.map((todo) => {
              return (
                <li className="todo-item" key={todo.id}>
                  <label>
                    <input type="checkbox" name="completed" />
                    <span>{todo.name}</span>
                  </label>
                </li>
              );
            })}
          </ul>
        ) : (
          <p>No tasks yet. You should make a few!</p>
        )}
        TODO: Add an input to create a new task
      </section>
    </main>
  );
}

export function CatchBoundary() {
  let caught = useCatch();
  switch (caught.status) {
    case 404:
      return <h1>Project not found</h1>;
    case 500:
      return <h1>Server error; try again later!</h1>;
    default:
      throw Error("Uncaught exception");
  }
}

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <div>
      <h1>Something got goofed! Try again later!</h1>
      <p>{error.message}</p>
    </div>
  );
}

interface LoaderData {
  project: Project;
}

export type { LoaderData as ProjectLoaderData };

function isValidProjectId(pid: any): pid is string {
  return typeof pid === "string";
}
