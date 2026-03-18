import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import type { CreateClassPayload } from '@/services/classes'
import { BookOpen, FileText, Hash, Save, Users } from 'lucide-react'
import { type FormEventHandler, useEffect, useState } from 'react'

type ClassModalValues = {
  classId?: number
  classCode: string
  className: string
  classOrder: number
  maximumCapacity: number
  description: string
}

type ClassCreateModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: 'create' | 'edit'
  initialValues?: ClassModalValues | null
  onSubmit: (payload: CreateClassPayload | { classId: number; classCode: string; className: string; classOrder: number; maximumCapacity: number; description: string }) => Promise<void> | void
  isSubmitting?: boolean
}

export function ClassCreateModal({
  open,
  onOpenChange,
  mode,
  initialValues,
  onSubmit,
  isSubmitting = false,
}: ClassCreateModalProps) {
  const [classCode, setClassCode] = useState('')
  const [className, setClassName] = useState('')
  const [classOrder, setClassOrder] = useState('')
  const [maximumCapacity, setMaximumCapacity] = useState('')
  const [description, setDescription] = useState('')

  useEffect(() => {
    if (!open) return
    setClassCode(initialValues?.classCode ?? '')
    setClassName(initialValues?.className ?? '')
    setClassOrder(typeof initialValues?.classOrder === 'number' ? String(initialValues.classOrder) : '')
    setMaximumCapacity(typeof initialValues?.maximumCapacity === 'number' ? String(initialValues.maximumCapacity) : '')
    setDescription(initialValues?.description ?? '')
  }, [initialValues, open])

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()
    const parsedClassOrder = Number.parseInt(classOrder, 10)
    const parsedMaximumCapacity = Number.parseInt(maximumCapacity, 10)
    if (!classCode.trim() || !className.trim() || Number.isNaN(parsedClassOrder) || Number.isNaN(parsedMaximumCapacity)) return
    if (mode === 'edit') {
      if (!initialValues?.classId) return
      await onSubmit({
        classId: initialValues.classId,
        classCode: classCode.trim(),
        className: className.trim(),
        classOrder: parsedClassOrder,
        maximumCapacity: parsedMaximumCapacity,
        description: description.trim(),
      })
    } else {
      await onSubmit({
        classCode: classCode.trim(),
        className: className.trim(),
        classOrder: parsedClassOrder,
        maximumCapacity: parsedMaximumCapacity,
        description: description.trim(),
      })
    }
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl border-white/20 bg-white/95 p-6 sm:rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-gray-800">{mode === 'edit' ? 'Edit Class' : 'Create New Class'}</DialogTitle>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-gray-500">
              Class Code <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                value={classCode}
                onChange={(event) => setClassCode(event.target.value)}
                placeholder="e.g. NUR, LKG, UKG, CL1"
                className="w-full rounded-xl border border-white/30 bg-white/50 py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                required
              />
            </div>
            <p className="text-xs text-gray-500">Short code for the class</p>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-gray-500">
              Class Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                value={className}
                onChange={(event) => setClassName(event.target.value)}
                placeholder="e.g. Class 10, UKG, Nursery"
                className="w-full rounded-xl border border-white/30 bg-white/50 py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-gray-500">
              Numeric Grade Level <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="number"
                value={classOrder}
                onChange={(event) => setClassOrder(event.target.value)}
                placeholder="e.g. 1, 2, 3"
                className="w-full rounded-xl border border-white/30 bg-white/50 py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                required
              />
            </div>
            <p className="text-xs text-gray-500">Used for sorting and grade order</p>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-gray-500">
              Maximum Capacity <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="number"
                placeholder="e.g. 100"
                value={maximumCapacity}
                onChange={(event) => setMaximumCapacity(event.target.value)}
                className="w-full rounded-xl border border-white/30 bg-white/50 py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-gray-500">Description</label>
            <div className="relative">
              <FileText className="absolute left-3 top-4 text-gray-400" size={18} />
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Brief description of the class level..."
                rows={4}
                className="w-full rounded-xl border border-white/30 bg-white/50 py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
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
              {isSubmitting ? (mode === 'edit' ? 'Updating...' : 'Creating...') : mode === 'edit' ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
