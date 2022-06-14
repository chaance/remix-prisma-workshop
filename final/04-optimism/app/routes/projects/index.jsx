import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { prisma, handlePrismaClientError } from "~/db.server";

export const loader = async () => {
  try {
    let projects = await prisma.project.findMany({
      select: { id: true, name: true },
      orderBy: { createdAt: "desc" },
    });
    return json({ projects }, 200);
  } catch (fetchError) {
    if (fetchError instanceof Response) {
      throw fetchError;
    }

    let statusText = "There was an error fetching the project";
    handlePrismaClientError(fetchError, statusText);
    throw json(null, { status: 500, statusText });
  }
};

export default function ProjectsRoute() {
  let { projects } = useLoaderData();
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
      <hr />
      <aside aria-label="Project actions">
        <Link to="/projects/create" className="button">
          Create a Project
        </Link>
      </aside>
    </main>
  );
}
