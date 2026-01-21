import { createApp } from "./app";
import { env } from "./config/env";
import { connectDb } from "./config/db";
import { logger } from "./config/logger";

async function main() {
  await connectDb();
  const app = createApp();

  app.listen(env.PORT, () => {
    logger.info({ port: env.PORT }, "API running");
  });
}

main().catch((err) => {
  logger.error({ err }, "Fatal startup error");
  process.exit(1);
});
