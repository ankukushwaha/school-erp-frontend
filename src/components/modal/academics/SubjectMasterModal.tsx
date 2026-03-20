import { AlertCircle, Save, X } from 'lucide-react'
import { useCreateSubjectMutation, useUpdateSubjectMutation } from '@/hooks/useSubjectsMutation'
import type { SubjectCategory, SubjectRecord } from '@/services/subjects'
import axios from 'axios'
import { type FormEvent, useEffect, useState } from 'react'

type SubjectType = 'Core' | 'Elective' | 'Language' | 'Skill' | 'Co-Curricular'

type SubjectFormState = {
  subjectCode: string
  subjectName: string
  subjectType: SubjectType
  category: SubjectCategory
  description: string
  totalMarks: string
  passingMarks: string
}

const initialFormState: SubjectFormState = {
  subjectCode: '',
  subjectName: '',
  subjectType: 'Core',
  category: 'Academic',
  description: '',
  totalMarks: '',
  passingMarks: '',
}

function normalizeSubjectType(value: string): SubjectType {
  switch (value) {
    case 'Core':
    case 'Elective':
    case 'Language':
    case 'Skill':
    case 'Co-Curricular':
      return value
    default:
      return 'Core'
  }
}

function getApiErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const responseData = error.response?.data
    if (typeof responseData === 'string' && responseData.trim()) return responseData
    if (responseData && typeof responseData === 'object') {
      const message =
        ('message' in responseData && typeof responseData.message === 'string' && responseData.message) ||
        ('title' in responseData && typeof responseData.title === 'string' && responseData.title)
      if (message) return message
      if ('errors' in responseData && responseData.errors && typeof responseData.errors === 'object') {
        const firstError = Object.values(responseData.errors)
          .flatMap((value) => (Array.isArray(value) ? value : []))
          .find((value) => typeof value === 'string' && value.trim())
        if (typeof firstError === 'string') return firstError
      }
    }
  }
  return error instanceof Error ? error.message : fallback
}

type SubjectMasterModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  editingSubject: SubjectRecord | null
  onSuccess: (message: string) => void
}

export function SubjectMasterModal({ open, onOpenChange, editingSubject, onSuccess }: SubjectMasterModalProps) {
  const createSubjectMutation = useCreateSubjectMutation()
  const updateSubjectMutation = useUpdateSubjectMutation()
  const [formData, setFormData] = useState<SubjectFormState>(initialFormState)
  const [submitError, setSubmitError] = useState('')

  const isMutating = createSubjectMutation.isPending || updateSubjectMutation.isPending

  useEffect(() => {
    if (!open) return
    if (editingSubject) {
      setFormData({
        subjectCode: editingSubject.subjectCode,
        subjectName: editingSubject.subjectName,
        subjectType: normalizeSubjectType(editingSubject.subjectType),
        category: editingSubject.category ?? 'Academic',
        description: editingSubject.description,
        totalMarks: String(editingSubject.totalMarks),
        passingMarks: String(editingSubject.passingMarks),
      })
    } else {
      setFormData(initialFormState)
    }
    setSubmitError('')
  }, [open, editingSubject])

  const handleClose = () => {
    onOpenChange(false)
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setSubmitError('')

    const totalMarks = Number(formData.totalMarks)
    const passingMarks = Number(formData.passingMarks)
    const description = formData.description.trim()

    if (!description) {
      setSubmitError('Description is required.')
      return
    }
    if (Number.isNaN(totalMarks) || totalMarks <= 0) {
      setSubmitError('Total Marks must be greater than 0.')
      return
    }
    if (Number.isNaN(passingMarks) || passingMarks < 0 || passingMarks > totalMarks) {
      setSubmitError('Passing Marks must be between 0 and Total Marks.')
      return
    }

    try {
      if (editingSubject) {
        await updateSubjectMutation.mutateAsync({
          subjectId: Number(editingSubject.id),
          subjectName: formData.subjectName.trim(),
          subjectCode: formData.subjectCode.trim().toUpperCase(),
          isOptional: formData.subjectType === 'Elective',
          subjectType: formData.subjectType,
          category: formData.category,
          description,
          minMarks: 0,
          maxMarks: totalMarks,
          passMarks: passingMarks,
          authAdd: 'Admin',
          authLstEdt: null,
          authDel: null,
          addOnDt: null,
          editOnDt: null,
          delOnDt: null,
          delStatus: false,
        })
        onSuccess('Subject updated successfully.')
      } else {
        await createSubjectMutation.mutateAsync({
          subjectId: 0,
          subjectName: formData.subjectName.trim(),
          subjectCode: formData.subjectCode.trim().toUpperCase(),
          isOptional: formData.subjectType === 'Elective',
          subjectType: formData.subjectType,
          category: formData.category,
          description,
          minMarks: 0,
          maxMarks: totalMarks,
          passMarks: passingMarks,
          authAdd: 'Admin',
          authLstEdt: null,
          authDel: null,
          addOnDt: new Date().toISOString(),
          editOnDt: null,
          delOnDt: null,
          delStatus: false,
        })
        onSuccess('Subject created successfully.')
      }
      onOpenChange(false)
    } catch (error) {
      setSubmitError(getApiErrorMessage(error, 'Failed to save subject.'))
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">{editingSubject ? 'Edit Subject' : 'Add New Subject'}</h2>
            <button onClick={handleClose} className="p-2 hover:bg-white/20 rounded-lg transition-all">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Subject Code *</label>
              <input
                type="text"
                value={formData.subjectCode}
                onChange={(event) => setFormData({ ...formData, subjectCode: event.target.value.toUpperCase() })}
                placeholder="e.g., ENG, MATH, SCI"
                className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 transition-colors uppercase"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Unique subject code</p>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Subject Name *</label>
              <input
                type="text"
                value={formData.subjectName}
                onChange={(event) => setFormData({ ...formData, subjectName: event.target.value })}
                placeholder="e.g., Mathematics"
                className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 transition-colors"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Subject Type *</label>
              <select
                value={formData.subjectType}
                onChange={(event) => setFormData({ ...formData, subjectType: event.target.value as SubjectType })}
                className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 transition-colors"
                required
              >
                <option value="Core">Core</option>
                <option value="Elective">Elective</option>
                <option value="Language">Language</option>
                <option value="Skill">Skill</option>
                <option value="Co-Curricular">Co-Curricular</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Category *</label>
              <select
                value={formData.category}
                onChange={(event) => setFormData({ ...formData, category: event.target.value as SubjectCategory })}
                className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 transition-colors"
                required
              >
                <option value="Academic">Academic</option>
                <option value="Non-Academic">Non-Academic</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Description *</label>
            <textarea
              value={formData.description}
              onChange={(event) => setFormData({ ...formData, description: event.target.value })}
              placeholder="Brief description of the subject..."
              rows={3}
              className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 transition-colors resize-none"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Total Marks *</label>
              <input
                type="number"
                value={formData.totalMarks}
                onChange={(event) => setFormData({ ...formData, totalMarks: event.target.value })}
                placeholder="e.g., 100"
                className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Passing Marks *</label>
              <input
                type="number"
                value={formData.passingMarks}
                onChange={(event) => setFormData({ ...formData, passingMarks: event.target.value })}
                placeholder="e.g., 35"
                className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 transition-colors"
                required
              />
            </div>
          </div>

          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <p className="font-semibold mb-1">Important Note:</p>
              <p>After creating a subject, you can map it to specific classes from the next academic setup step.</p>
            </div>
          </div>

          {submitError ? (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">{submitError}</div>
          ) : null}

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={isMutating}
              className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <Save className="w-5 h-5" />
              {isMutating ? 'Saving...' : editingSubject ? 'Update Subject' : 'Save Subject'}
            </button>
            <button
              type="button"
              onClick={handleClose}
              disabled={isMutating}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
