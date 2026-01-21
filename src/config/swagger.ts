import swaggerJSDoc from "swagger-jsdoc";


export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: "3.0.3",
    info: {
      title: "Shop Backend API",
      version: "1.0.0",
      description: "MVP e-commerce backend (Express + Prisma)",
    },
    servers: [{ url: process.env.API_BASE_URL ?? "http://localhost:4000" }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
        adminKey: {
          type: "apiKey",
          in: "header",
          name: "x-admin-key",
        },
      },
    },
  },
  // We'll use JSDoc comments inside route/controller files
  apis: ["src/modules/**/*.ts"],
});
