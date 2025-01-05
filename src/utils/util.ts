import { PERMISSIONS } from "./const";

export const checkPermissions = (arr: string[]) => {
  let sanitized = sanitizeArrayElements(arr);
  return sanitized.filter((permission) => !PERMISSIONS.includes(permission));
};

export const sanitizeArrayElements = (arr: string[]): string[] => {
  return arr.map((e) => {
    return e.trim();
  });
};

export const rolePermissionsMap = {
  admin: ["create", "read", "update", "delete"],
  editor: ["read", "update"],
  viewer: ["read"],
};
