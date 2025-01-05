import { Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { User } from "../models/user.model";
import { PERMISSIONS, ROLES } from "../utils/const";
import { checkPermissions, rolePermissionsMap, sanitizeArrayElements } from "../utils/util";

export const updateUserRole = catchAsync(async (req: Request, res: Response) => {
  const { userId, role } = req.body;
  if (!userId || !role) {
    return res.status(403).json({ error: "userId or role is missing" });
  }
  if (typeof role != "string") {
    return res.status(403).json({ error: "Invalid or multiple roles added" });
  }
  if (!ROLES.includes(role)) {
    return res.status(403).json({ error: `invalid role. Available roles: ${ROLES.join(", ")}` });
  }
  let permissions: string[] = rolePermissionsMap[role];
  await User.update({ role, permissions: permissions.join(",") }, { where: { id: userId } });
  res.json({ message: "role updated succesfully" });
});

export const updateUserPermissions = catchAsync(async (req: Request, res: Response) => {
  const { userId, permissions } = req.body;
  if (!userId) {
    return res.status(403).json({ error: "userId missing" });
  }
  if (!Array.isArray(permissions) || (Array.isArray(permissions) && permissions.length == 0)) {
    return res.status(403).json({ error: "permissons missing" });
  }
  if (checkPermissions(permissions).length > 0) {
    return res.status(403).json({ error: `Invalid permissions: ${checkPermissions(permissions).join(", ")}. Permissions allowed:  ${PERMISSIONS.join(", ")}` });
  }
  let sanitized = sanitizeArrayElements(permissions);
  await User.update({ permissions: sanitized.join(",") }, { where: { id: userId } });
  res.json({ message: "role updated succesfully" });
});
