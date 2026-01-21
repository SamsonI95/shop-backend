"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
exports.connectDb = connectDb;
const client_1 = require("@prisma/client");
const logger_1 = require("./logger");
exports.prisma = new client_1.PrismaClient();
async function connectDb() {
    try {
        await exports.prisma.$connect();
        logger_1.logger.info("Database connected");
    }
    catch (err) {
        logger_1.logger.error({ err }, "Database connection failed");
        throw err;
    }
}
