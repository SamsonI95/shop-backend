import { Router } from "express";
import { ok } from "../../utils/apiResponse";

export const healthRoutes = Router();

healthRoutes.get("/", (_req, res) => {
  return res.json(ok("ok", { uptime: process.uptime() }));
});
