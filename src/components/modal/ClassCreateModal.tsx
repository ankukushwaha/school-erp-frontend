import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import type { CreateClassPayload } from '@/services/classes'
import { BookOpen, GraduationCap, Hash, Save } from 'lucide-react'
import { type FormEventHandler, useEffect, useState } from 'react'

type ClassModalValues = {
  classId?: number
  className: string
  classOrder: number
  classTeacher?: string
  annualFee?: number
}

type ClassCreateModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: 'create' | 'edit'
  initialValues?: ClassModalValues | null
  onSubmit: (payload: CreateClassPayload | { classId: number; className: string; classOrder: number }) => Promise<void> | void
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
  const [className, setClassName] = useState('')
  const [classOrder, setClassOrder] = useState('')
  const [classTeacher, setClassTeacher] = useState('')
  const [annualFee, setAnnualFee] = useState('')

  useEffect(() => {
    if (!open) return
    setClassName(initialValues?.className ?? '')
    setClassOrder(typeof initialValues?.classOrder === 'number' ? String(initialValues.classOrder) : '')
    setClassTeacher(initialValues?.classTeacher ?? '')
    setAnnualFee(typeof initialValues?.annualFee === 'number' ? String(initialValues.annualFee) : '')
  }, [initialValues, open])

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()
    const parsedClassOrder = Number.parseInt(classOrder, 10)
    if (!className.trim() || Number.isNaN(parsedClassOrder)) return
    if (mode === 'edit') {
      if (!initialValues?.classId) return
      await onSubmit({ classId: initialValues.classId, className: className.trim(), classOrder: parsedClassOrder })
    } else {
      await onSubmit({ className: className.trim(), classOrder: parsedClassOrder })
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
              Class Code <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="number"
                value={classOrder}
                onChange={(event) => setClassOrder(event.target.value)}
                placeholder="e.g. 10"
                className="w-full rounded-xl border border-white/30 bg-white/50 py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                required
              />
            </div>
            <p className="text-xs text-gray-500">Used for sorting and identification</p>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-gray-500">
              Class Teacher <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Teacher name"
                value={classTeacher}
                onChange={(event) => setClassTeacher(event.target.value)}
                className="w-full rounded-xl border border-white/30 bg-white/50 py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-gray-500">
              Annual Fee (Rs) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              placeholder="35000"
              value={annualFee}
              onChange={(event) => setAnnualFee(event.target.value)}
              className="w-full rounded-xl border border-white/30 bg-white/50 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
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
