import { Dialog, DialogContent } from '@/components/ui/dialog'
import { useCreateAcademicYearMutation, useUpdateAcademicYearMutation } from '@/hooks/useAcademicYearsQuery'
import type { AcademicYear, Term } from '@/services/academicYears'
import { Plus, Save, Trash2 } from 'lucide-react'
import { type FormEventHandler, useEffect, useState } from 'react'

type AcademicYearModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  editingYear: AcademicYear | null
  onSuccess: (message: string) => void
  onError: (message: string) => void
}

const emptyTerm = (): Term => ({
  id: Date.now(),
  name: 'Term 1',
  startDate: '',
  endDate: '',
  workingDays: 0,
})

export function AcademicYearModal({ open, onOpenChange, editingYear, onSuccess, onError }: AcademicYearModalProps) {
  const createMutation = useCreateAcademicYearMutation()
  const updateMutation = useUpdateAcademicYearMutation()

  const [yearName, setYearName] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [terms, setTerms] = useState<Term[]>([emptyTerm()])

  const isMutating = createMutation.isPending || updateMutation.isPending

  useEffect(() => {
    if (!open) return
    if (editingYear) {
      setYearName(editingYear.yearName)
      setStartDate(editingYear.startDate)
      setEndDate(editingYear.endDate)
      setTerms(editingYear.terms.length > 0 ? editingYear.terms : [emptyTerm()])
    } else {
      setYearName('')
      setStartDate('')
      setEndDate('')
      setTerms([emptyTerm()])
    }
  }, [open, editingYear])

  const addTerm = () => {
    setTerms((prev) => [
      ...prev,
      { id: Date.now(), name: `Term ${prev.length + 1}`, startDate: '', endDate: '', workingDays: 0 },
    ])
  }

  const removeTerm = (id: number) => {
    setTerms((prev) => (prev.length > 1 ? prev.filter((t) => t.id !== id) : prev))
  }

  const updateTerm = (id: number, field: keyof Term, value: string | number) => {
    setTerms((prev) => prev.map((t) => (t.id === id ? { ...t, [field]: value } : t)))
  }

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()
    const payload = { yearName, startDate, endDate, terms, status: editingYear?.status ?? ('Upcoming' as const) }

    try {
      if (editingYear) {
        await updateMutation.mutateAsync({ id: editingYear.id, payload })
        onSuccess('Academic year updated successfully.')
      } else {
        await createMutation.mutateAsync(payload)
        onSuccess('Academic year created successfully.')
      }
      onOpenChange(false)
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Failed to save academic year.')
    }
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) onOpenChange(false) }}>
      <DialogContent className="max-h-[90vh] max-w-xl overflow-y-auto border-white/20 bg-white/95 p-6 sm:rounded-2xl">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-800">{editingYear ? 'Edit Academic Year' : 'Create Academic Year'}</h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-gray-500">
              Academic Year <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={yearName}
              onChange={(e) => setYearName(e.target.value)}
              placeholder="e.g. 2024-2025"
              className="w-full rounded-xl border border-white/30 bg-white/50 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-gray-500">
                Start Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full rounded-xl border border-white/30 bg-white/50 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-gray-500">
                End Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full rounded-xl border border-white/30 bg-white/50 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                required
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase text-gray-500">
                Terms <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={addTerm}
                className="flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-700"
              >
                <Plus size={14} /> Add Term
              </button>
            </div>

            <div className="max-h-72 space-y-3 overflow-y-auto">
              {terms.map((term) => (
                <div key={term.id} className="space-y-3 rounded-xl border border-white/40 bg-white/40 p-4">
                  <div className="flex items-center justify-between">
                    <input
                      type="text"
                      value={term.name}
                      onChange={(e) => updateTerm(term.id, 'name', e.target.value)}
                      placeholder="Term name"
                      className="flex-1 rounded-lg border border-white/30 bg-white/50 px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      required
                    />
                    {terms.length > 1 ? (
                      <button
                        type="button"
                        onClick={() => removeTerm(term.id)}
                        className="ml-2 rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-white hover:text-red-600"
                      >
                        <Trash2 size={14} />
                      </button>
                    ) : null}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-1 block text-[10px] font-bold uppercase text-gray-500">Start Date</label>
                      <input
                        type="date"
                        value={term.startDate}
                        onChange={(e) => updateTerm(term.id, 'startDate', e.target.value)}
                        className="w-full rounded-lg border border-white/30 bg-white/50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                        required
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-[10px] font-bold uppercase text-gray-500">End Date</label>
                      <input
                        type="date"
                        value={term.endDate}
                        onChange={(e) => updateTerm(term.id, 'endDate', e.target.value)}
                        className="w-full rounded-lg border border-white/30 bg-white/50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-[10px] font-bold uppercase text-gray-500">Working Days</label>
                    <input
                      type="number"
                      value={term.workingDays}
                      onChange={(e) => updateTerm(term.id, 'workingDays', Number.parseInt(e.target.value, 10) || 0)}
                      placeholder="120"
                      className="w-full rounded-lg border border-white/30 bg-white/50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      required
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              disabled={isMutating}
              className="flex-1 rounded-xl border border-gray-200 bg-white py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isMutating}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 py-2.5 text-sm font-medium text-white shadow-lg shadow-indigo-600/30 transition-all hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <Save size={18} />
              {isMutating ? 'Saving...' : editingYear ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
