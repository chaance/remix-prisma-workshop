import { Link } from "@remix-run/react";
import type { Project } from "~/types";

const projects = [
  { id: "001", name: "Prepare Remix/Prisma workshop" },
  { id: "002", name: "Build a new Remix feature" },
  { id: "003", name: "Go surfing" },
];

export default function ProjectsRoute() {
  return (
    <main>
      <h1>Projects</h1>
      {projects.length > 0 ? (
        <ul className="projects-list">
          {projects.map((project) => {
            return (
              <li key={project.id}>
                <Link to={project.id}>{project.name}</Link>
              </li>
            );
          })}
        </ul>
      ) : (
        <p>No projects found</p>
      )}
    </main>
  );
}

interface LoaderData {
  projects: Pick<Project, "name" | "id">[];
}
