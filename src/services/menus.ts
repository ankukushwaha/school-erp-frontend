import { backendApi } from '@/services/backendApi'
import type { AuthenticatedRole } from '@/types/auth'
import { ROLE_MENU } from '@/app/constants/sidebarMenu'

export type MenuItem = {
  id: number | null
  key: string | null
  label: string
  path: string | null
  iconName: string | null
  displayOrder: number
  children: MenuItem[]
}

type MenuApiRecord = {
  menuId?: unknown
  menuKey?: unknown
  iconName?: unknown
  displayOrder?: unknown
  label?: unknown
  title?: unknown
  name?: unknown
  menuName?: unknown
  displayName?: unknown
  path?: unknown
  route?: unknown
  url?: unknown
  menuPath?: unknown
  menuUrl?: unknown
  routePath?: unknown
  role?: unknown
  children?: unknown
}

type MenusApiResponse = MenuApiRecord[] | { data?: unknown; items?: unknown; result?: unknown }

function asString(value: unknown): string | null {
  return typeof value === 'string' && value.trim() ? value.trim() : null
}

function getRoleValue(value: unknown): AuthenticatedRole | null {
  if (value === 'admin' || value === 'teacher' || value === 'student') return value

  const numericValue = typeof value === 'string' ? Number(value) : (typeof value === 'number' ? value : null)
  if (numericValue !== null && !isNaN(numericValue)) {
    for (const [role, data] of Object.entries(ROLE_MENU)) {
      if (data.id === numericValue) {
        return role as AuthenticatedRole
      }
    }
  }
  return null
}

function getResponseItems(payload: MenusApiResponse): MenuApiRecord[] {
  if (Array.isArray(payload)) return payload

  const container = payload.data ?? payload.items ?? payload.result
  if (!Array.isArray(container)) return []

  return container as MenuApiRecord[]
}

function asNumber(value: unknown): number | null {
  if (typeof value === 'number' && !isNaN(value)) return value
  if (typeof value === 'string') {
    const parsed = Number(value)
    if (!isNaN(parsed)) return parsed
  }
  return null
}

function normalizePath(path: string | null): string | null {
  if (!path) return null
  if (path.startsWith('/')) return path
  return `/${path}`
}

function normalizeMenu(item: MenuApiRecord): MenuItem | null {
  const label = asString(item.label) ?? asString(item.title) ?? asString(item.name) ?? asString(item.menuName) ?? asString(item.displayName)
  const path = normalizePath(
    asString(item.path) ?? asString(item.route) ?? asString(item.url) ?? asString(item.menuPath) ?? asString(item.menuUrl) ?? asString(item.routePath),
  )
  const childrenPayload = Array.isArray(item.children) ? (item.children as MenuApiRecord[]) : []
  const children = childrenPayload.map(normalizeMenu).filter((entry): entry is MenuItem => entry !== null)

  if (!label) return null

  return {
    id: asNumber(item.menuId),
    key: asString(item.menuKey),
    label,
    path,
    iconName: asString(item.iconName),
    displayOrder: asNumber(item.displayOrder) ?? 0,
    children: children.sort((a, b) => a.displayOrder - b.displayOrder),
  }
}

export async function getMenus(role: AuthenticatedRole | null): Promise<MenuItem[]> {
  const payload = role ? { role: ROLE_MENU[role].id } : {}
  const response = await backendApi.post<MenusApiResponse>('/master/menus', payload)
  const items = getResponseItems(response.data)

  const roleFilteredItems = role
    ? items.filter((item) => {
      const itemRole = getRoleValue(item.role)
      return itemRole ? itemRole === role : true
    })
    : items

  return roleFilteredItems
    .map(normalizeMenu)
    .filter((item): item is MenuItem => item !== null)
    .sort((a, b) => a.displayOrder - b.displayOrder)
}

