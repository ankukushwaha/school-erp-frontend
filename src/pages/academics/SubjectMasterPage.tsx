import {
  ArrowLeft,
  Award,
  Book,
  BookOpen,
  CheckCircle,
  Code,
  Edit,
  Filter,
  Plus,
  Trash2,
} from 'lucide-react'
import { useDeleteSubjectMutation, useSubjectsQuery } from '@/hooks/useSubjectsMutation'
import { SubjectMasterModal } from '@/components/modal/academics/SubjectMasterModal'
import { ConfirmActionModal } from '@/components/modal/academics/ConfirmActionModal'
import type { SubjectCategory, SubjectRecord } from '@/services/subjects'
import axios from 'axios'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

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

const getTypeColor = (type: string) => {
  switch (type) {
    case 'Core': return 'bg-blue-100 text-blue-700 border-blue-200'
    case 'Elective': return 'bg-purple-100 text-purple-700 border-purple-200'
    case 'Language': return 'bg-green-100 text-green-700 border-green-200'
    case 'Skill': return 'bg-orange-100 text-orange-700 border-orange-200'
    case 'Co-Curricular': return 'bg-pink-100 text-pink-700 border-pink-200'
    default: return 'bg-gray-100 text-gray-700 border-gray-200'
  }
}

const getCategoryColor = (category: SubjectCategory | null) => {
  if (category === 'Academic') return 'bg-indigo-100 text-indigo-700 border-indigo-200'
  if (category === 'Non-Academic') return 'bg-rose-100 text-rose-700 border-rose-200'
  return 'bg-gray-100 text-gray-700 border-gray-200'
}

export function SubjectMasterPage() {
  const navigate = useNavigate()
  const { data: subjects = [], isLoading, isError } = useSubjectsQuery()
  const deleteSubjectMutation = useDeleteSubjectMutation()

  const [showModal, setShowModal] = useState(false)
  const [editingSubject, setEditingSubject] = useState<SubjectRecord | null>(null)
  const [subjectToDelete, setSubjectToDelete] = useState<SubjectRecord | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterCategory, setFilterCategory] = useState('all')
  const [showFilters, setShowFilters] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [submitSuccess, setSubmitSuccess] = useState('')

  const openCreateModal = () => {
    setEditingSubject(null)
    setShowModal(true)
  }

  const openEditModal = (subject: SubjectRecord) => {
    setEditingSubject(subject)
    setShowModal(true)
  }

  const handleDeleteConfirm = async () => {
    if (!subjectToDelete) return
    try {
      await deleteSubjectMutation.mutateAsync(Number(subjectToDelete.id))
      setSubmitSuccess('Subject deleted successfully.')
      setSubmitError('')
    } catch (error) {
      setSubmitSuccess('')
      setSubmitError(getApiErrorMessage(error, 'Failed to delete subject.'))
    }
    setSubjectToDelete(null)
    setIsDeleteModalOpen(false)
  }

  const filteredSubjects = useMemo(() => {
    return subjects.filter((subject) => {
      const normalizedSearch = searchTerm.toLowerCase()
      const matchesSearch =
        subject.subjectName.toLowerCase().includes(normalizedSearch) ||
        subject.subjectCode.toLowerCase().includes(normalizedSearch)
      const matchesType = filterType === 'all' || subject.subjectType === filterType
      const matchesCategory = filterCategory === 'all' || subject.category === filterCategory
      return matchesSearch && matchesType && matchesCategory
    })
  }, [filterCategory, filterType, searchTerm, subjects])

  const totalSubjects = subjects.length
  const activeSubjects = subjects.filter((subject) => subject.isActive).length
  const academicSubjects = subjects.filter((subject) => subject.category === 'Academic').length
  const coreSubjects = subjects.filter((subject) => subject.subjectType === 'Core').length

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/academics')} className="rounded-full bg-gray-100 p-2 text-gray-600 transition-colors hover:bg-gray-200">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Subject Master</h1>
              <p className="text-gray-600 mt-1">Register and manage all subjects</p>
            </div>
          </div>
          <button
            onClick={openCreateModal}
            className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add Subject
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Subjects</p>
              <p className="text-2xl font-bold text-gray-900">{totalSubjects}</p>
              <p className="text-xs text-gray-500 mt-1">Registered</p>
            </div>
            <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Active</p>
              <p className="text-2xl font-bold text-green-600">{activeSubjects}</p>
              <p className="text-xs text-gray-500 mt-1">Currently active</p>
            </div>
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Academic</p>
              <p className="text-2xl font-bold text-purple-600">{academicSubjects}</p>
              <p className="text-xs text-gray-500 mt-1">Academic subjects</p>
            </div>
            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
              <Award className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Core Subjects</p>
              <p className="text-2xl font-bold text-blue-600">{coreSubjects}</p>
              <p className="text-xs text-gray-500 mt-1">Mandatory</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <Book className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Code className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by subject name or code..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="w-full pl-12 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-5 py-2.5 bg-white border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-all flex items-center gap-2 text-sm"
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>

        {showFilters ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-200">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subject Type</label>
              <select
                value={filterType}
                onChange={(event) => setFilterType(event.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              >
                <option value="all">All Types</option>
                <option value="Core">Core</option>
                <option value="Elective">Elective</option>
                <option value="Language">Language</option>
                <option value="Skill">Skill</option>
                <option value="Co-Curricular">Co-Curricular</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={filterCategory}
                onChange={(event) => setFilterCategory(event.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              >
                <option value="all">All Categories</option>
                <option value="Academic">Academic</option>
                <option value="Non-Academic">Non-Academic</option>
              </select>
            </div>
          </div>
        ) : null}
      </div>

      <div className="flex items-center justify-between px-1">
        <p className="text-sm font-medium text-gray-700">
          Showing <span className="font-semibold text-gray-900">{filteredSubjects.length}</span> of{' '}
          <span className="font-semibold text-gray-900">{totalSubjects}</span> subjects
        </p>
      </div>

      {isError ? <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">Failed to load subjects.</div> : null}
      {submitError ? <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">{submitError}</div> : null}
      {submitSuccess ? <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-sm text-green-700">{submitSuccess}</div> : null}

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">S/N</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Code</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Subject Name</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Is Optional</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Marks</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={9} className="px-6 py-6 text-center text-sm text-gray-500">Loading subjects...</td>
                </tr>
              ) : null}
              {filteredSubjects.map((subject, index) => (
                <tr key={subject.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-semibold text-gray-700">{index + 1}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                        <Code className="w-4 h-4 text-indigo-600" />
                      </div>
                      <span className="font-semibold text-gray-900">{subject.subjectCode}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">{subject.subjectName}</p>
                      <p className="text-xs text-gray-500">{subject.description || 'No description available'}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-lg text-xs font-semibold border ${subject.isOptional ? 'bg-amber-100 text-amber-700 border-amber-200' : 'bg-slate-100 text-slate-700 border-slate-200'}`}>
                      {subject.isOptional ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-lg text-xs font-semibold border ${getTypeColor(subject.subjectType)}`}>
                      {subject.subjectType}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-lg text-xs font-semibold border ${getCategoryColor(subject.category)}`}>
                      {subject.category ?? 'N/A'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <p className="font-semibold text-gray-900">Total: {subject.totalMarks}</p>
                      <p className="text-xs text-gray-600">Pass: {subject.passingMarks}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-lg text-xs font-semibold border ${subject.isActive ? 'bg-green-100 text-green-700 border-green-200' : 'bg-gray-100 text-gray-700 border-gray-200'}`}>
                      {subject.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(subject)}
                        className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-all"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => { setSubjectToDelete(subject); setIsDeleteModalOpen(true) }}
                        disabled={deleteSubjectMutation.isPending}
                        className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {!isLoading && filteredSubjects.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">No subjects found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria</p>
        </div>
      ) : null}

      <ConfirmActionModal
        open={isDeleteModalOpen}
        onOpenChange={(open) => {
          setIsDeleteModalOpen(open)
          if (!open) setSubjectToDelete(null)
        }}
        title="Delete Subject"
        description={`Are you sure you want to delete ${subjectToDelete?.subjectName ?? 'this subject'}?`}
        confirmLabel={deleteSubjectMutation.isPending ? 'Deleting...' : 'Delete'}
        cancelLabel="Cancel"
        onConfirm={handleDeleteConfirm}
      />

      <SubjectMasterModal
        open={showModal}
        onOpenChange={(open) => {
          setShowModal(open)
          if (!open) setEditingSubject(null)
        }}
        editingSubject={editingSubject}
        onSuccess={(message) => {
          setSubmitSuccess(message)
          setSubmitError('')
        }}
      />
    </div>
  )
}
