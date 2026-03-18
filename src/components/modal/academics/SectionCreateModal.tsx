import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import type { CreateSectionPayload } from '@/services/sections'
import { Layers, Save } from 'lucide-react'
import { type FormEventHandler, useEffect, useState } from 'react'

type SectionCreateModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  className?: string
  onSubmit: (payload: CreateSectionPayload) => Promise<void> | void
  isSubmitting?: boolean
}

export function SectionCreateModal({
  open,
  onOpenChange,
  className,
  onSubmit,
  isSubmitting = false,
}: SectionCreateModalProps) {
  const defaultAuthAdd = '555'
  const [sectionName, setSectionName] = useState('')
  const [sectionCode, setSectionCode] = useState('')

  useEffect(() => {
    if (!open) return
    setSectionName('')
    setSectionCode('')
  }, [open])

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()
    if (!sectionName.trim() || !sectionCode.trim()) return

    await onSubmit({
      sectionName: sectionName.trim(),
      sectionCode: sectionCode.trim(),
      authAdd: defaultAuthAdd,
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl border-white/20 bg-white/95 p-6 sm:rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-gray-800">Add New Section</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {className ? (
            <div className="rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-sm text-indigo-700">
              Creating section for <span className="font-semibold">{className}</span>
            </div>
          ) : null}

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-gray-500">
              Section Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Layers className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                value={sectionName}
                onChange={(event) => setSectionName(event.target.value)}
                placeholder="e.g. Section A"
                className="w-full rounded-xl border border-white/30 bg-white/50 py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-gray-500">
              Section Code <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Layers className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                value={sectionCode}
                onChange={(event) => setSectionCode(event.target.value)}
                placeholder="e.g. Sec-A"
                className="w-full rounded-xl border border-white/30 bg-white/50 py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                required
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
              className="flex-1 rounded-xl border border-gray-200 bg-white py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 py-2.5 text-sm font-medium text-white shadow-lg shadow-indigo-600/30 transition-all hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <Save size={18} />
              {isSubmitting ? 'Saving...' : 'Save Section'}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
