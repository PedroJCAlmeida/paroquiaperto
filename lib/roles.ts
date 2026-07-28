export function normalizeRole(role?: string | null): string {
  if (typeof role !== 'string') {
    return 'user';
  }

  const normalized = role.trim().toLowerCase();
  if (!normalized) {
    return 'user';
  }

  const adminAliases = ['admin', 'administrator', 'root', 'superadmin', 'super_admin', 'super-admin'];
  return adminAliases.includes(normalized) ? 'admin' : normalized;
}

export function hasRequiredRole(userRole?: string | null, requiredRole?: string | null): boolean {
  const normalizedUserRole = normalizeRole(userRole);
  const normalizedRequiredRole = normalizeRole(requiredRole);

  if (!normalizedRequiredRole) {
    return false;
  }

  return normalizedUserRole === normalizedRequiredRole;
}

export function isAdminRole(userRole?: string | null): boolean {
  return normalizeRole(userRole) === 'admin';
}
