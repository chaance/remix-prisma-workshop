import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seed() {
  let email = "unclebabybilly@remix.run";

  // cleanup the existing database
  await prisma.user.delete({ where: { email } }).catch(() => {
    // no worries if it doesn't exist yet
  });

  let hashedPassword = await bcrypt.hash("gemstones", 10);

  let user = await prisma.user.create({
    data: {
      name: "Uncle Baby Billy",
      email,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });

  let [projectPrep, projectBuild /*, projectSurf */] = await Promise.all([
    prisma.project.create({
      data: {
        name: "Prepare Remix/Prisma workshop",
        description:
          "You have a Prisma day workshop coming up, let's make it awesome.",
        userId: user.id,
      },
    }),

    prisma.project.create({
      data: {
        name: "Build a new Remix feature",
        description: "This one should probably be good so that people like it.",
        userId: user.id,
      },
    }),

    prisma.project.create({
      data: {
        name: "Go surfing",
        description: "Not much to it, just take a break and vibe.",
        userId: user.id,
      },
    }),
  ]);

  await Promise.all([
    prisma.todo.create({
      data: {
        name: "Write some material",
        projectId: projectPrep.id,
        completed: true,
      },
    }),

    prisma.todo.create({
      data: {
        name: "Get feedback",
        projectId: projectPrep.id,
        completed: true,
      },
    }),

    prisma.todo.create({
      data: {
        name: "Review and rehearse",
        projectId: projectPrep.id,
      },
    }),

    prisma.todo.create({
      data: {
        name: "Figure out what people want",
        projectId: projectBuild.id,
      },
    }),

    prisma.todo.create({
      data: {
        name: "Build it",
        projectId: projectBuild.id,
      },
    }),
  ]);

  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
