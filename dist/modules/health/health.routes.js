"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.healthRoutes = void 0;
const express_1 = require("express");
const apiResponse_1 = require("../../utils/apiResponse");
exports.healthRoutes = (0, express_1.Router)();
exports.healthRoutes.get("/", (_req, res) => {
    return res.json((0, apiResponse_1.ok)("ok", { uptime: process.uptime() }));
});
