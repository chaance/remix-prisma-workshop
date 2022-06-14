import * as React from "react";
import { useCatch } from "@remix-run/react";

const project = {
  name: "Prepare Remix/Prisma workshop",
  todos: [
    { id: "001", name: "Write some material", completed: true },
    { id: "002", name: "Get feedback", completed: true },
    { id: "003", name: "Review and rehearse", completed: false },
  ],
};

export default function ProjectRoute() {
  return (
    <main>
      <header>
        <h1>{project.name}</h1>
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

export function ErrorBoundary({ error }) {
  return (
    <div>
      <h1>Something got goofed! Try again later!</h1>
      <p>{error.message}</p>
    </div>
  );
}
