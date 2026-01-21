"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMeSchema = void 0;
const zod_1 = require("zod");
exports.updateMeSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).max(120).optional()
});
