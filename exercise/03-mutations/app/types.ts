import type { Project, Todo } from "@prisma/client";

interface ProjectWithTodos extends Project {
  todos: Todo[];
}

export type { ProjectWithTodos as Project, Todo };
