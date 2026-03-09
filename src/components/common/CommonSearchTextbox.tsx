import { getCommonSearchResult, type CommonSearchBaseParams, type CommonSearchItem } from '@/services/commonSearch'
import { Search } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

type CommonSearchTextboxSharedProps = {
  value: string
  onChange: (value: string) => void
  onSelect?: (item: CommonSearchItem) => void
  placeholder?: string
  required?: boolean
  minChars?: number
}

type CommonSearchTextboxConfigProps = {
  searchConfig: CommonSearchBaseParams
}

type CommonSearchTextboxLegacyProps = {
  schemaName: string
  tableName: string
  columnId: string
  displayColumns: string
  displayName: string
  otherCondition?: string
  sortBy?: string
}

type CommonSearchTextboxProps = CommonSearchTextboxSharedProps & (CommonSearchTextboxConfigProps | CommonSearchTextboxLegacyProps)

export function CommonSearchTextbox({
  ...props
}: CommonSearchTextboxProps) {
  const {
  value,
  onChange,
  onSelect,
  placeholder = 'Type to search...',
  required = false,
  minChars = 1,
  } = props
  const containerRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [headers, setHeaders] = useState<string[]>([])
  const [items, setItems] = useState<CommonSearchItem[]>([])

  const resolvedConfig: CommonSearchBaseParams =
    'searchConfig' in props
      ? props.searchConfig
      : {
          schemaName: props.schemaName,
          tableName: props.tableName,
          columnId: props.columnId,
          displayColumns: props.displayColumns,
          displayName: props.displayName,
          otherCondition: props.otherCondition ?? '',
          sortBy: props.sortBy ?? '',
        }

  const { schemaName, tableName, columnId, displayColumns, displayName, otherCondition, sortBy } = resolvedConfig

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  useEffect(() => {
    const term = value.trim()
    if (!open || term.length < minChars) {
      setItems([])
      setHeaders([])
      setError('')
      return
    }

    let active = true
    const timeout = window.setTimeout(async () => {
      try {
        setLoading(true)
        const result = await getCommonSearchResult({
          schemaName,
          tableName,
          columnId,
          displayColumns,
          displayName,
          searchTerm: term,
          otherCondition,
          sortBy,
        })
        if (!active) return
        setItems(result.items)
        setHeaders(result.headers)
        setError('')
      } catch {
        if (!active) return
        if (import.meta.env.DEV) {
          console.error('Common search failed', { schemaName, tableName, columnId, displayColumns, displayName, searchTerm: term })
        }
        setError('Failed to fetch search results.')
        setHeaders([])
        setItems([])
      } finally {
        if (active) setLoading(false)
      }
    }, 250)

    return () => {
      active = false
      window.clearTimeout(timeout)
    }
  }, [columnId, displayColumns, displayName, minChars, open, otherCondition, schemaName, sortBy, tableName, value])

  return (
    <div ref={containerRef} className="relative">
      <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
      <input
        type="text"
        value={value}
        onFocus={() => setOpen(true)}
        onChange={(event) => {
          onChange(event.target.value)
          if (!open) setOpen(true)
        }}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-xl border border-white/30 bg-white/50 py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
      />

      {open ? (
        <div className="absolute z-50 mt-2 max-h-60 w-full overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-xl">
          {!loading && !error && headers.length > 0 ? (
            <div className="grid border-b border-gray-100 bg-gray-50 px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-gray-500" style={{ gridTemplateColumns: `repeat(${headers.length}, minmax(0, 1fr))` }}>
              {headers.map((header) => (
                <span key={header} className="truncate pr-2">
                  {header}
                </span>
              ))}
            </div>
          ) : null}
          {value.trim().length < minChars ? <p className="px-3 py-2 text-xs text-gray-500">Type at least {minChars} character(s).</p> : null}
          {loading ? <p className="px-3 py-2 text-xs text-gray-500">Loading...</p> : null}
          {!loading && error ? <p className="px-3 py-2 text-xs text-red-600">{error}</p> : null}
          {!loading && !error && value.trim().length >= minChars && items.length === 0 ? <p className="px-3 py-2 text-xs text-gray-500">No results found.</p> : null}
          {!loading && !error
            ? items.map((item) => (
                <button
                  key={`${item.id}`}
                  type="button"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => {
                    onChange(item.label)
                    onSelect?.(item)
                    setOpen(false)
                  }}
                  className="w-full px-3 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-indigo-50"
                >
                  {headers.length > 1 ? (
                    <div className="grid" style={{ gridTemplateColumns: `repeat(${headers.length}, minmax(0, 1fr))` }}>
                      {headers.map((_, index) => (
                        <span key={`${item.id}-${index}`} className="truncate pr-2">
                          {item.columnValues?.[index] ?? (index === 0 ? item.label : '')}
                        </span>
                      ))}
                    </div>
                  ) : (
                    item.label
                  )}
                </button>
              ))
            : null}
        </div>
      ) : null}
    </div>
  )
}
