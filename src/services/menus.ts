import { backendApi } from '@/services/backendApi'
import type { AuthenticatedRole } from '@/types/auth'

export type MenuItem = {
  label: string
  path: string
}

type MenuApiRecord = {
  label?: unknown
  title?: unknown
  name?: unknown
  menuName?: unknown
  path?: unknown
  route?: unknown
  url?: unknown
  menuPath?: unknown
  menuUrl?: unknown
  role?: unknown
}

type MenusApiResponse = MenuApiRecord[] | { data?: unknown; items?: unknown; result?: unknown }

function asString(value: unknown): string | null {
  return typeof value === 'string' && value.trim() ? value.trim() : null
}

function getRoleValue(value: unknown): AuthenticatedRole | null {
  if (value === 'admin' || value === 'teacher' || value === 'student') return value
  return null
}

function getResponseItems(payload: MenusApiResponse): MenuApiRecord[] {
  if (Array.isArray(payload)) return payload

  const container = payload.data ?? payload.items ?? payload.result
  if (!Array.isArray(container)) return []

  return container as MenuApiRecord[]
}

function normalizeMenu(item: MenuApiRecord): MenuItem | null {
  const label = asString(item.label) ?? asString(item.title) ?? asString(item.name) ?? asString(item.menuName)
  const path = asString(item.path) ?? asString(item.route) ?? asString(item.url) ?? asString(item.menuPath) ?? asString(item.menuUrl)

  if (!label || !path) return null

  return { label, path }
}

export async function getMenus(role: AuthenticatedRole | null): Promise<MenuItem[]> {
  const response = await backendApi.get<MenusApiResponse>('/master/menus')
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
}

