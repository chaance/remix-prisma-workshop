import { Prisma, PrismaClient } from "@prisma/client";

let prisma: PrismaClient;

declare global {
  var __db__: PrismaClient;
}

// this is needed because in development we don't want to restart
// the server with every change, but we want to make sure we don't
// create a new connection to the DB with every change either.
// in production we'll have a single connection to the DB.
if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!global.__db__) {
    global.__db__ = new PrismaClient();
  }
  prisma = global.__db__;
  prisma.$connect();
}

export function handlePrismaClientError(error: any, defaultMessage: string) {
  let status = 500;
  let statusText = defaultMessage;
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // https://www.prisma.io/docs/reference/api-reference/error-reference
    statusText = error.message;
    switch (error.code) {
      case "P1000":
      case "P1010":
        status = 401;
        break;
      case "P1002":
        status = 408;
        break;
      case "P1012":
      case "P1013":
        status = 422;
        break;
      default:
        break;
    }

    throw new Response("null", {
      status,
      statusText,
      headers: new Headers({
        "Content-Type": "application/json; charset=utf-8",
      }),
    });
  }
}

export { prisma };
