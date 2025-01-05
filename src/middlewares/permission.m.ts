import { NextFunction, Request, Response } from "express";

export const permissionMiddleware = (actions: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.user.role !== "admin") {
      const userPermissions: string[] = req.user?.permissions?.trim()?.split(",") || [];
      const hasPermission = actions.some((action) => userPermissions.includes(action));
      if (!hasPermission) {
        res.status(403).json({
          message: `You do not have the required permissions: [${actions.join(", ")}]`,
        });
        return;
      }
    }
    next();
  };
};
