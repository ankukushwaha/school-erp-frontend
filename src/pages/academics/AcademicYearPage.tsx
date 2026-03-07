import {
  useAcademicYearsQuery,
  useCreateAcademicYearMutation,
  useDeleteAcademicYearMutation,
  useUpdateAcademicYearMutation,
} from '@/hooks/useAcademicYearsQuery'
import type { AcademicYear, Term } from '@/services/academicYears'
import {
  AlertCircle,
  ArrowLeft,
  BookOpen,
  Calendar,
  CheckCircle2,
  Edit2,
  Plus,
  Save,
  Trash2,
  X,
} from 'lucide-react'
import { type FormEventHandler, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

type Notice = { type: 'success' | 'error'; message: string } | null

const emptyTerm = (): Term => ({
  id: Date.now(),
  name: 'Term 1',
  startDate: '',
  endDate: '',
  workingDays: 0,
})

const formatDate = (value: string) => {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '-'
  return date.toLocaleDateString()
}

const normalizeAcademicYears = (items: AcademicYear[] | undefined): AcademicYear[] => {
  if (!items) return []
  return items.map((item) => ({
    ...item,
    terms: Array.isArray(item.terms) ? item.terms : [],
  }))
}

export function AcademicYearPage() {
  const navigate = useNavigate()
  const { data, isLoading, isError, error } = useAcademicYearsQuery()
  const createMutation = useCreateAcademicYearMutation()
  const updateMutation = useUpdateAcademicYearMutation()
  const deleteMutation = useDeleteAcademicYearMutation()

  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingYear, setEditingYear] = useState<AcademicYear | null>(null)
  const [notice, setNotice] = useState<Notice>(null)

  const [yearName, setYearName] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [terms, setTerms] = useState<Term[]>([emptyTerm()])

  useEffect(() => {
    setAcademicYears(normalizeAcademicYears(data))
  }, [data])

  const addTerm = () => {
    setTerms((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: `Term ${prev.length + 1}`,
        startDate: '',
        endDate: '',
        workingDays: 0,
      },
    ])
  }

  const removeTerm = (id: number) => {
    setTerms((prev) => (prev.length > 1 ? prev.filter((term) => term.id !== id) : prev))
  }

  const updateTerm = (id: number, field: keyof Term, value: string | number) => {
    setTerms((prev) => prev.map((term) => (term.id === id ? { ...term, [field]: value } : term)))
  }

  const resetForm = () => {
    setYearName('')
    setStartDate('')
    setEndDate('')
    setTerms([emptyTerm()])
    setShowForm(false)
    setEditingYear(null)
  }

  const getStatusColor = (status: AcademicYear['status']) => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-100 text-emerald-700'
      case 'Upcoming':
        return 'bg-blue-100 text-blue-700'
      case 'Completed':
        return 'bg-gray-100 text-gray-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()
    setNotice(null)

    const payload = { yearName, startDate, endDate, terms, status: editingYear?.status ?? ('Upcoming' as const) }

    try {
      if (editingYear) {
        await updateMutation.mutateAsync({ id: editingYear.id, payload })
        setNotice({ type: 'success', message: 'Academic year updated successfully.' })
      } else {
        await createMutation.mutateAsync(payload)
        setNotice({ type: 'success', message: 'Academic year created successfully.' })
      }
      resetForm()
    } catch (submitError) {
      setNotice({
        type: 'error',
        message: submitError instanceof Error ? submitError.message : 'Failed to save academic year.',
      })
    }
  }

  const editYear = (year: AcademicYear) => {
    setEditingYear(year)
    setYearName(year.yearName)
    setStartDate(year.startDate)
    setEndDate(year.endDate)
    setTerms(year.terms.length > 0 ? year.terms : [emptyTerm()])
    setShowForm(true)
  }

  const deleteYear = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this academic year?')) return

    setNotice(null)
    try {
      await deleteMutation.mutateAsync(id)
      setNotice({ type: 'success', message: 'Academic year deleted successfully.' })
    } catch (deleteError) {
      setNotice({
        type: 'error',
        message: deleteError instanceof Error ? deleteError.message : 'Failed to delete academic year.',
      })
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="rounded-full bg-white/40 p-2 text-gray-600 transition-colors hover:bg-white/60"
            aria-label="Back to dashboard"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-800">Academic Year Setup</h1>
            <p className="mt-1 text-sm text-gray-500">Define academic years, terms, and schedules</p>
          </div>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 font-medium text-white shadow-lg shadow-indigo-600/30 transition-all hover:bg-indigo-700"
        >
          <Plus size={18} />
          New Academic Year
        </button>
      </div>

      {notice ? (
        <div
          className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-sm ${
            notice.type === 'success'
              ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
              : 'border-red-200 bg-red-50 text-red-700'
          }`}
        >
          {notice.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          <span>{notice.message}</span>
        </div>
      ) : null}

      {isError ? (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle size={16} />
          <span>Failed to load academic years: {error instanceof Error ? error.message : 'Unknown error'}</span>
        </div>
      ) : null}

      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="flex-1 space-y-4">
          {isLoading ? (
            <div className="rounded-2xl border border-white/20 bg-white/40 p-6 text-sm text-gray-600 shadow-lg backdrop-blur-xl">
              Loading academic years...
            </div>
          ) : null}

          {!isLoading && academicYears.length === 0 ? (
            <div className="rounded-2xl border border-white/20 bg-white/40 p-6 text-sm text-gray-600 shadow-lg backdrop-blur-xl">
              No academic years found.
            </div>
          ) : null}

          {academicYears.map((year) => (
            <div
              key={year.id}
              className="rounded-2xl border border-white/20 bg-white/40 p-6 shadow-lg transition-all hover:bg-white/60"
            >
              <div className="mb-4 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                    <Calendar size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{year.yearName}</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {formatDate(year.startDate)} - {formatDate(year.endDate)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(year.status)}`}>
                    {year.status}
                  </span>
                  <button
                    onClick={() => editYear(year)}
                    className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-white hover:text-indigo-600"
                    aria-label={`Edit ${year.yearName}`}
                  >
                    <Edit2 size={16} />
                  </button>
                  {year.status !== 'Active' ? (
                    <button
                      onClick={() => void deleteYear(year.id)}
                      className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-white hover:text-red-600"
                      aria-label={`Delete ${year.yearName}`}
                    >
                      <Trash2 size={16} />
                    </button>
                  ) : null}
                </div>
              </div>

              <div className="mt-4 space-y-3">
                <h4 className="text-sm font-bold uppercase tracking-wide text-gray-700">Terms</h4>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  {year.terms.map((term) => (
                    <div key={term.id} className="rounded-xl border border-white/40 bg-white/60 p-4">
                      <div className="mb-2 flex items-center gap-2">
                        <BookOpen size={16} className="text-indigo-600" />
                        <h5 className="font-bold text-gray-800">{term.name}</h5>
                      </div>
                      <div className="space-y-1 text-xs text-gray-600">
                        <p>Start: {formatDate(term.startDate)}</p>
                        <p>End: {formatDate(term.endDate)}</p>
                        <p className="font-medium text-indigo-600">Working Days: {term.workingDays}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {showForm ? (
          <div className="sticky top-6 h-fit w-full rounded-2xl border border-white/20 bg-white/60 p-6 shadow-xl backdrop-blur-xl lg:w-[480px]">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-800">{editingYear ? 'Edit Academic Year' : 'Create Academic Year'}</h3>
              <button onClick={resetForm} className="text-gray-400 hover:text-gray-600" aria-label="Close form">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-gray-500">
                  Academic Year <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={yearName}
                  onChange={(event) => setYearName(event.target.value)}
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
                    onChange={(event) => setStartDate(event.target.value)}
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
                    onChange={(event) => setEndDate(event.target.value)}
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

                <div className="max-h-96 space-y-3 overflow-y-auto">
                  {terms.map((term) => (
                    <div key={term.id} className="space-y-3 rounded-xl border border-white/40 bg-white/40 p-4">
                      <div className="flex items-center justify-between">
                        <input
                          type="text"
                          value={term.name}
                          onChange={(event) => updateTerm(term.id, 'name', event.target.value)}
                          placeholder="Term name"
                          className="flex-1 rounded-lg border border-white/30 bg-white/50 px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                          required
                        />
                        {terms.length > 1 ? (
                          <button
                            type="button"
                            onClick={() => removeTerm(term.id)}
                            className="ml-2 rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-white hover:text-red-600"
                            aria-label={`Remove ${term.name}`}
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
                            onChange={(event) => updateTerm(term.id, 'startDate', event.target.value)}
                            className="w-full rounded-lg border border-white/30 bg-white/50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                            required
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-[10px] font-bold uppercase text-gray-500">End Date</label>
                          <input
                            type="date"
                            value={term.endDate}
                            onChange={(event) => updateTerm(term.id, 'endDate', event.target.value)}
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
                          onChange={(event) => updateTerm(term.id, 'workingDays', Number.parseInt(event.target.value, 10) || 0)}
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
                  onClick={resetForm}
                  className="flex-1 rounded-xl border border-gray-200 bg-white py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 py-2.5 text-sm font-medium text-white shadow-lg shadow-indigo-600/30 transition-all hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <Save size={18} />
                  {editingYear ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        ) : null}
      </div>
    </div>
  )
}
