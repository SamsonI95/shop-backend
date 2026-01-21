"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const env_1 = require("./config/env");
const db_1 = require("./config/db");
const logger_1 = require("./config/logger");
async function main() {
    await (0, db_1.connectDb)();
    const app = (0, app_1.createApp)();
    app.listen(env_1.env.PORT, () => {
        logger_1.logger.info({ port: env_1.env.PORT }, "API running");
    });
}
main().catch((err) => {
    logger_1.logger.error({ err }, "Fatal startup error");
    process.exit(1);
});
