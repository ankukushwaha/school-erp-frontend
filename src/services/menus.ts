import { backendApi } from '@/services/backendApi'
import type { AuthenticatedRole } from '@/types/auth'
import { ROLE_MENU } from '@/app/constants/sidebarMenu'

export type MenuItem = {
  label: string
  path: string
}

type MenuApiRecord = {
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

function flattenMenus(items: MenuApiRecord[]): MenuApiRecord[] {
  return items.flatMap((item) => {
    const children = Array.isArray(item.children) ? item.children as MenuApiRecord[] : []
    return [item, ...flattenMenus(children)]
  })
}

function normalizeMenu(item: MenuApiRecord): MenuItem | null {
  const label = asString(item.label) ?? asString(item.title) ?? asString(item.name) ?? asString(item.menuName) ?? asString(item.displayName)
  const path = asString(item.path) ?? asString(item.route) ?? asString(item.url) ?? asString(item.menuPath) ?? asString(item.menuUrl) ?? asString(item.routePath)

  if (!label || !path) return null

  return { label, path }
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

  const flatItems = flattenMenus(roleFilteredItems)

  return flatItems
    .map(normalizeMenu)
    .filter((item): item is MenuItem => item !== null)
}

