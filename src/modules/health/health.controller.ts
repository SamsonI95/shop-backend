import type { Request, Response } from "express";
import { ok } from "../../utils/apiResponse";

export function health(_req: Request, res: Response) {
  return res.json(ok("ok", { uptime: process.uptime() }));
}
