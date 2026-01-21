"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.me = me;
exports.updateMe = updateMe;
const db_1 = require("../../config/db");
const apiResponse_1 = require("../../utils/apiResponse");
async function me(req, res, next) {
    try {
        const userId = req.user.userId;
        const user = await db_1.prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, email: true, name: true, role: true, createdAt: true }
        });
        return res.json((0, apiResponse_1.ok)("Me", user));
    }
    catch (e) {
        next(e);
    }
}
async function updateMe(req, res, next) {
    try {
        const userId = req.user.userId;
        const user = await db_1.prisma.user.update({
            where: { id: userId },
            data: { name: req.body.name },
            select: { id: true, email: true, name: true, role: true }
        });
        return res.json((0, apiResponse_1.ok)("Updated", user));
    }
    catch (e) {
        next(e);
    }
}
