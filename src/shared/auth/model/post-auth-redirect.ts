const DASHBOARD_PREFIX = "/dashboard"
const ORGANIZATIONS_PREFIX = "/organizations"
const SETTINGS_PATH = "/dashboard/settings"
const ORGANIZATION_NEW_PATH = "/organizations/new"
const ORGANIZATION_INVITATIONS_PATH = "/organizations/invitations"

type ResolvePostAuthRedirectInput = {
  redirectTo?: string
  hasOrganizations: boolean
}

function isPath(value: string, path: string) {
  return value === path || value === `${path}/`
}

function isWithinPath(value: string, path: string) {
  return isPath(value, path) || value.startsWith(`${path}/`)
}

function getPathname(value: string) {
  return value.split(/[?#]/, 1)[0] ?? value
}

export function resolvePostAuthRedirect({
  redirectTo,
  hasOrganizations,
}: ResolvePostAuthRedirectInput) {
  const pathname = redirectTo ? getPathname(redirectTo) : null

  if (!pathname) {
    return hasOrganizations ? DASHBOARD_PREFIX : ORGANIZATIONS_PREFIX
  }

  if (isWithinPath(pathname, ORGANIZATIONS_PREFIX)) {
    if (isWithinPath(pathname, ORGANIZATION_NEW_PATH)) {
      return ORGANIZATION_NEW_PATH
    }

    if (isWithinPath(pathname, ORGANIZATION_INVITATIONS_PATH)) {
      return hasOrganizations
        ? `${DASHBOARD_PREFIX}/invitations`
        : ORGANIZATION_INVITATIONS_PATH
    }

    return hasOrganizations ? DASHBOARD_PREFIX : ORGANIZATIONS_PREFIX
  }

  if (isWithinPath(pathname, DASHBOARD_PREFIX)) {
    if (isWithinPath(pathname, SETTINGS_PATH)) {
      return SETTINGS_PATH
    }

    if (isWithinPath(pathname, `${DASHBOARD_PREFIX}/invitations`)) {
      return hasOrganizations
        ? `${DASHBOARD_PREFIX}/invitations`
        : ORGANIZATION_INVITATIONS_PATH
    }

    return hasOrganizations ? redirectTo : ORGANIZATIONS_PREFIX
  }

  return redirectTo
}
