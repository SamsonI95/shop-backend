import type { Request, Response, NextFunction } from "express";
import { ok } from "../../utils/apiResponse";
import { AppError } from "../../middlewares/error";
import * as service from "./uploads.service";

export async function presignProductImage(req: Request, res: Response, next: NextFunction) {
  try {
    const body = (res.locals as any).body ?? req.body;
    const { filename, contentType } = body;

    try {
      const result = await service.presignProductImageUpload(filename, contentType);
      return res.status(201).json(ok("Presigned upload created", result));
    } catch (e: any) {
      throw new AppError(e?.message ?? "Upload presign failed", 400);
    }
  } catch (e) {
    next(e);
  }
}
