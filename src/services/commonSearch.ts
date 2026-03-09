import { backendApi } from '@/services/backendApi'

export type CommonSearchParams = {
  schemaName: string
  tableName: string
  columnId: string
  displayColumns: string
  displayName: string
  searchTerm: string
  otherCondition: string
  sortBy: string
}

export type CommonSearchBaseParams = Omit<CommonSearchParams, 'searchTerm'>

export type CommonSearchItem = {
  id: string | number
  label: string
  raw: Record<string, unknown>
  columnValues?: string[]
}

export type CommonSearchResult = {
  headers: string[]
  items: CommonSearchItem[]
}

type CommonSearchApiResponse =
  | Array<Record<string, unknown> | string | number>
  | { data?: unknown; items?: unknown; result?: unknown; records?: unknown; displayName?: unknown; headers?: unknown }

function normalizeKey(value: string): string {
  return value.toLowerCase().replace(/[\s_-]+/g, '')
}

function getByKey(record: Record<string, unknown>, key: string): unknown {
  if (!key) return undefined
  if (key in record) return record[key]
  const normalizedTarget = normalizeKey(key)
  const matchedKey = Object.keys(record).find((itemKey) => normalizeKey(itemKey) === normalizedTarget)
  return matchedKey ? record[matchedKey] : undefined
}

function asItems(payload: CommonSearchApiResponse): Array<Record<string, unknown> | string | number> {
  if (Array.isArray(payload)) return payload
  const nested = payload.data ?? payload.items ?? payload.result ?? payload.records
  return Array.isArray(nested) ? (nested as Array<Record<string, unknown> | string | number>) : []
}

function getBestLabel(record: Record<string, unknown>, preferredKey: string): string {
  const direct = getByKey(record, preferredKey)
  if (typeof direct === 'string' && direct.trim()) return direct

  const commonLabelKeys = ['display_name', 'displayname', 'name', 'label', 'title']
  for (const key of commonLabelKeys) {
    const value = getByKey(record, key)
    if (typeof value === 'string' && value.trim()) return value
  }

  const firstString = Object.values(record).find((value) => typeof value === 'string' && value.trim())
  return typeof firstString === 'string' ? firstString : ''
}

function getBestId(record: Record<string, unknown>, preferredKey: string, fallback: number): string | number {
  const direct = getByKey(record, preferredKey)
  if (typeof direct === 'string' || typeof direct === 'number') return direct

  const idLike = Object.entries(record).find(([key, value]) => normalizeKey(key).endsWith('id') && (typeof value === 'string' || typeof value === 'number'))
  if (idLike) return idLike[1] as string | number

  return fallback
}

function flattenCommonRecord(record: Record<string, unknown>): Record<string, unknown> {
  const columns = record.columns
  if (columns && typeof columns === 'object' && !Array.isArray(columns)) {
    return {
      ...record,
      ...(columns as Record<string, unknown>),
    }
  }
  return record
}

function getHeaders(payload: CommonSearchApiResponse, params: CommonSearchParams): string[] {
  const apiHeaders =
    payload && typeof payload === 'object' && !Array.isArray(payload) && Array.isArray(payload.headers)
      ? payload.headers.filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
      : []

  if (apiHeaders.length > 0) return apiHeaders

  return params.displayColumns
    .split(',')
    .map((item) => item.trim())
    .filter((item) => item.length > 0)
}

function getColumnValues(record: Record<string, unknown>, headers: string[]): string[] {
  if (headers.length === 0) return []
  return headers.map((header) => {
    const value = getByKey(record, header)
    if (typeof value === 'string') return value
    if (typeof value === 'number' || typeof value === 'boolean') return String(value)
    return ''
  })
}

export async function getCommonSearchResults(params: CommonSearchParams): Promise<CommonSearchItem[]> {
  const result = await getCommonSearchResult(params)
  return result.items
}

export async function getCommonSearchResult(params: CommonSearchParams): Promise<CommonSearchResult> {
  const response = await backendApi.get<CommonSearchApiResponse>('/common-search', {
    params: {
      schemaName: params.schemaName,
      tableName: params.tableName,
      columnId: params.columnId,
      displayColumns: params.displayColumns,
      displayName: params.displayName,
      searchTerm: params.searchTerm,
      otherCondition: params.otherCondition,
      sortBy: params.sortBy,
    },
  })

  const payload = response.data
  const records = asItems(payload)
  const headers = getHeaders(payload, params)
  const displayKey = params.displayName?.split(',')[0]?.trim() || params.displayColumns.split(',')[0]?.trim() || params.columnId

  const items = records
    .map((record, index) => {
      if (typeof record === 'string' || typeof record === 'number') {
        return {
          id: index + 1,
          label: String(record),
          raw: { value: record },
          columnValues: headers.length > 0 ? [String(record), ...new Array(Math.max(headers.length - 1, 0)).fill('')] : [String(record)],
        } satisfies CommonSearchItem
      }

      const flatRecord = flattenCommonRecord(record)
      const columnValues = getColumnValues(flatRecord, headers)
      const labelFromColumns = columnValues.find((value) => value.trim().length > 0) ?? ''
      return {
        id: getBestId(flatRecord, params.columnId, index + 1),
        label: labelFromColumns || getBestLabel(flatRecord, displayKey),
        raw: record,
        columnValues,
      } satisfies CommonSearchItem
    })
    .filter((item) => item.label.trim().length > 0)

  return {
    headers,
    items,
  }
}
