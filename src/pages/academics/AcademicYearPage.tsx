import { useAcademicYearsQuery, useDeleteAcademicYearMutation } from '@/hooks/useAcademicYearsQuery'
import { AcademicYearModal } from '@/components/modal/academics/AcademicYearModal'
import { ConfirmActionModal } from '@/components/modal/academics/ConfirmActionModal'
import type { AcademicYear } from '@/services/academicYears'
import {
  AlertCircle,
  ArrowLeft,
  BookOpen,
  Calendar,
  CheckCircle2,
  Edit2,
  Plus,
  Trash2,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

type Notice = { type: 'success' | 'error'; message: string } | null

const formatDate = (value: string) => {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '-'
  return date.toLocaleDateString()
}

const normalizeAcademicYears = (items: AcademicYear[] | undefined): AcademicYear[] => {
  if (!items) return []
  return items.map((item) => ({ ...item, terms: Array.isArray(item.terms) ? item.terms : [] }))
}

export function AcademicYearPage() {
  const navigate = useNavigate()
  const { data, isLoading, isError, error } = useAcademicYearsQuery()
  const deleteMutation = useDeleteAcademicYearMutation()

  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editingYear, setEditingYear] = useState<AcademicYear | null>(null)
  const [yearToDelete, setYearToDelete] = useState<AcademicYear | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [notice, setNotice] = useState<Notice>(null)

  useEffect(() => {
    setAcademicYears(normalizeAcademicYears(data))
  }, [data])

  const getStatusColor = (status: AcademicYear['status']) => {
    switch (status) {
      case 'Active': return 'bg-emerald-100 text-emerald-700'
      case 'Upcoming': return 'bg-blue-100 text-blue-700'
      case 'Completed': return 'bg-gray-100 text-gray-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const handleDeleteConfirm = async () => {
    if (!yearToDelete) return
    setNotice(null)
    try {
      await deleteMutation.mutateAsync(yearToDelete.id)
      setNotice({ type: 'success', message: 'Academic year deleted successfully.' })
    } catch (deleteError) {
      setNotice({ type: 'error', message: deleteError instanceof Error ? deleteError.message : 'Failed to delete academic year.' })
    }
    setYearToDelete(null)
    setIsDeleteModalOpen(false)
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
          onClick={() => { setEditingYear(null); setShowModal(true) }}
          className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 font-medium text-white shadow-lg shadow-indigo-600/30 transition-all hover:bg-indigo-700"
        >
          <Plus size={18} />
          New Academic Year
        </button>
      </div>

      {notice ? (
        <div className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-sm ${
          notice.type === 'success'
            ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
            : 'border-red-200 bg-red-50 text-red-700'
        }`}>
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

      <div className="space-y-4">
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
          <div key={year.id} className="rounded-2xl border border-white/20 bg-white/40 p-6 shadow-lg transition-all hover:bg-white/60">
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
                  onClick={() => { setEditingYear(year); setShowModal(true) }}
                  className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-white hover:text-indigo-600"
                  aria-label={`Edit ${year.yearName}`}
                >
                  <Edit2 size={16} />
                </button>
                {year.status !== 'Active' ? (
                  <button
                    onClick={() => { setYearToDelete(year); setIsDeleteModalOpen(true) }}
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

      <AcademicYearModal
        open={showModal}
        onOpenChange={(open) => {
          setShowModal(open)
          if (!open) setEditingYear(null)
        }}
        editingYear={editingYear}
        onSuccess={(message) => setNotice({ type: 'success', message })}
        onError={(message) => setNotice({ type: 'error', message })}
      />

      <ConfirmActionModal
        open={isDeleteModalOpen}
        onOpenChange={(open) => {
          setIsDeleteModalOpen(open)
          if (!open) setYearToDelete(null)
        }}
        title="Delete Academic Year"
        description={`Are you sure you want to delete ${yearToDelete?.yearName ?? 'this academic year'}?`}
        confirmLabel={deleteMutation.isPending ? 'Deleting...' : 'Delete'}
        cancelLabel="Cancel"
        onConfirm={handleDeleteConfirm}
      />
    </div>
  )
}
