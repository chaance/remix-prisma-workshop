import * as React from "react";
import { json } from "@remix-run/node";
import { useCatch, useLoaderData, useFetcher } from "@remix-run/react";
import { prisma } from "~/db.server";

export let loader = async (args) => {
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
    return json({ project }, 200);
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
  let { project } = useLoaderData();
  let createFetcher = useFetcher();
  let deleteFetcher = useFetcher();

  let isCreatingTodo =
    createFetcher.state === "submitting" ||
    (createFetcher.state === "loading" &&
      createFetcher.type === "actionReload");

  let todoWasCreated =
    createFetcher.type === "done" && !!createFetcher.data?.todo;

  let clearAndFocusInput = React.useCallback(
    (node) => {
      if (todoWasCreated) {
        node && (node.value = "");
        node?.focus();
      }
    },
    [todoWasCreated]
  );

  return (
    <main>
      <header>
        <div>
          <h1>{project.name}</h1>
          <p>{project.description}</p>
        </div>
        <deleteFetcher.Form
          method="post"
          action={`/projects/${project.id}/delete`}
        >
          <button className="button">Delete Project</button>
        </deleteFetcher.Form>
      </header>
      <hr />
      <section>
        <h2>Tasks</h2>
        {project.todos.length > 0 ? (
          <ul className="todo-list">
            {project.todos.map((todo) => {
              return (
                <TodoItem key={todo.id} todo={todo} disabled={isCreatingTodo} />
              );
            })}
          </ul>
        ) : (
          <p>No tasks yet. You should make a few!</p>
        )}
        <aside>
          <createFetcher.Form method="post" action="/todos/create">
            <h2>Create a task</h2>
            <div className="create-task" data-disabled={isCreatingTodo}>
              <label>
                <input
                  aria-label="Task"
                  type="text"
                  name="name"
                  required
                  placeholder="What do you need to do?"
                  disabled={isCreatingTodo}
                  ref={clearAndFocusInput}
                />
              </label>
              <input type="hidden" name="projectId" value={project.id} />
              <button
                className="button"
                type="submit"
                disabled={isCreatingTodo}
              >
                New Todo
              </button>
            </div>
          </createFetcher.Form>
        </aside>
      </section>
    </main>
  );
}

function TodoItem({ todo, disabled }) {
  let completeFetcher = useFetcher();
  let deleteFetcher = useFetcher();

  let isCompleted = todo.completed;
  if (
    // is currently submitting
    completeFetcher.state === "submitting" ||
    // is loading the action data after a submission
    (completeFetcher.type === "actionReload" &&
      completeFetcher.state === "loading")
  ) {
    isCompleted = Boolean(completeFetcher.submission.formData.get("completed"));
  }

  let erroredWhileCompleting = false;
  if (completeFetcher.type === "done") {
    if (completeFetcher.data && completeFetcher.data.todo) {
      todo = completeFetcher.data.todo;
      isCompleted = todo.completed;
    } else {
      isCompleted = todo.completed;
      erroredWhileCompleting = true;
    }
  }

  React.useEffect(() => {
    if (erroredWhileCompleting) {
      window.alert("Oh no, something went wrong while completing the task!");
    }
  }, [erroredWhileCompleting]);

  let isDeleting =
    // is currently submitting
    deleteFetcher.state === "submitting" ||
    // is loading the action data after a submission
    (deleteFetcher.type === "actionReload" &&
      deleteFetcher.state === "loading");

  return (
    <li className="todo-item">
      <completeFetcher.Form method="post" action={`/todos/${todo.id}/complete`}>
        <label>
          <input
            type="checkbox"
            checked={isCompleted}
            onChange={(e) => completeFetcher.submit(e.target.form)}
            disabled={isDeleting || disabled}
            name="completed"
          />
          <span>{todo.name}</span>
        </label>
      </completeFetcher.Form>
      <deleteFetcher.Form method="post" action={`/todos/${todo.id}/delete`}>
        <button disabled={isDeleting} aria-label={`Delete todo: ${todo.name}`}>
          Delete
        </button>
      </deleteFetcher.Form>
    </li>
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

export function ErrorBoundary({ error }) {
  return (
    <div>
      <h1>Something got goofed! Try again later!</h1>
      <p>{error.message}</p>
    </div>
  );
}

function isValidProjectId(pid) {
  return typeof pid === "string";
}
