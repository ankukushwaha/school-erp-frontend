import { ClassCreateModal } from '@/components/modal/academics/ClassCreateModal'
import { ConfirmActionModal } from '@/components/modal/academics/ConfirmActionModal'
import {
  ArrowLeft,
  BookOpen,
  Edit2,
  GraduationCap,
  Layers,
  Plus,
  Search,
  Trash2,
  Users,
} from 'lucide-react'
import { useClassesQuery, useCreateClassMutation, useDeleteClassMutation, useUpdateClassMutation } from '@/hooks/useClassesQuery'
import { type CreateClassPayload, type SchoolClass, type UpdateClassPayload } from '@/services/classes'
import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export function ClassManagementPage() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
  const [selectedClass, setSelectedClass] = useState<SchoolClass | null>(null)
  const [createError, setCreateError] = useState('')
  const [deleteError, setDeleteError] = useState('')
  const { data = [], isLoading, isError } = useClassesQuery()
  const createMutation = useCreateClassMutation()
  const updateMutation = useUpdateClassMutation()
  const deleteMutation = useDeleteClassMutation()
  const classCards = data

  const filteredClasses = useMemo<SchoolClass[]>(() => {
    const query = searchTerm.trim().toLowerCase()
    if (!query) return classCards
    return classCards.filter((item) => item.name.toLowerCase().includes(query) || item.classTeacher.toLowerCase().includes(query))
  }, [classCards, searchTerm])

  const totalSections = classCards.reduce((acc, item) => acc + item.sections, 0)
  const totalStudents = classCards.reduce((acc, item) => acc + item.students, 0)

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/academics')} className="rounded-full bg-white/40 p-2 text-gray-600 transition-colors hover:bg-white/60">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-800">Class Management</h1>
            <p className="mt-1 text-sm text-gray-500">Manage all classes from Nursery to Grade 12</p>
          </div>
        </div>
        <button
          onClick={() => {
            setModalMode('create')
            setSelectedClass(null)
            setIsCreateModalOpen(true)
          }}
          className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 font-medium text-white shadow-lg shadow-indigo-600/30 transition-all hover:bg-indigo-700"
        >
          <Plus size={18} />
          Add New Class
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <div className="rounded-2xl border border-white/20 bg-white/40 p-6 shadow-lg backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
              <BookOpen size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Classes</p>
              <p className="text-2xl font-bold text-gray-800">{classCards.length}</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-white/20 bg-white/40 p-6 shadow-lg backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
              <Layers size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Sections</p>
              <p className="text-2xl font-bold text-gray-800">{totalSections}</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-white/20 bg-white/40 p-6 shadow-lg backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
              <Users size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Students</p>
              <p className="text-2xl font-bold text-gray-800">{totalStudents}</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-white/20 bg-white/40 p-6 shadow-lg backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
              <GraduationCap size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Class Teachers</p>
              <p className="text-2xl font-bold text-gray-800">{classCards.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search classes by name or class teacher..."
          className="w-full rounded-xl border border-white/30 bg-white/50 py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        />
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="flex-1">
          {isError ? (
            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">Failed to load classes.</div>
          ) : null}
          {createError ? <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{createError}</div> : null}
          {deleteError ? <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{deleteError}</div> : null}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {isLoading ? (
              <div className="rounded-2xl border border-white/20 bg-white/40 p-6 text-sm text-gray-600 shadow-lg backdrop-blur-xl">Loading classes...</div>
            ) : null}
            {!isLoading && filteredClasses.length === 0 ? (
              <div className="rounded-2xl border border-white/20 bg-white/40 p-6 text-sm text-gray-600 shadow-lg backdrop-blur-xl">
                No classes found.
              </div>
            ) : null}
            {filteredClasses.map((item) => (
              <div
                key={item.id}
                className="group rounded-2xl border border-white/20 bg-white/40 p-6 shadow-lg transition-all hover:bg-white/60 backdrop-blur-xl"
              >
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-xl font-bold text-white shadow-lg">
                    {item.code}
                  </div>
                  <div className="flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                    <button
                      onClick={() => {
                        setModalMode('edit')
                        setSelectedClass(item)
                        setIsCreateModalOpen(true)
                      }}
                      className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-white hover:text-indigo-600"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedClass(item)
                        setIsDeleteModalOpen(true)
                      }}
                      className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-white hover:text-red-600"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <h3 className="mb-1 text-xl font-bold text-gray-800">{item.name}</h3>
                <p className="mb-4 text-sm text-gray-500">Class Teacher: {item.classTeacher}</p>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-gray-500">
                      <Layers size={14} /> Sections
                    </span>
                    <span className="font-bold text-gray-800">{item.sections}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-gray-500">
                      <Users size={14} /> Students
                    </span>
                    <span className="font-bold text-gray-800">{item.students}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-gray-500">
                      <BookOpen size={14} /> Subjects
                    </span>
                    <span className="font-bold text-gray-800">{item.subjects}</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-gray-200 pt-2 text-sm">
                    <span className="text-gray-500">Annual Fee</span>
                    <span className="font-bold text-indigo-600">Rs {item.fee.toLocaleString()}</span>
                  </div>
                </div>

                <div className="mt-4 flex gap-2 border-t border-gray-200 pt-4">
                  <Link to={`/academics/sections?class=${item.id}`} className="flex-1 rounded-lg py-2 text-center text-xs font-medium text-indigo-600 transition-colors hover:bg-indigo-50">
                    View Sections
                  </Link>
                  <Link to={`/academics/subjects?class=${item.id}`} className="flex-1 rounded-lg py-2 text-center text-xs font-medium text-indigo-600 transition-colors hover:bg-indigo-50">
                    View Subjects
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ClassCreateModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        mode={modalMode}
        initialValues={
          modalMode === 'edit' && selectedClass
            ? {
                classId: selectedClass.id,
                className: selectedClass.name,
                classOrder: selectedClass.code,
                classTeacher: selectedClass.classTeacher,
                annualFee: selectedClass.fee,
              }
            : null
        }
        isSubmitting={createMutation.isPending || updateMutation.isPending}
        onSubmit={async (payload) => {
          try {
            if (modalMode === 'edit') {
              await updateMutation.mutateAsync(payload as UpdateClassPayload)
            } else {
              await createMutation.mutateAsync(payload as CreateClassPayload)
            }
            setCreateError('')
          } catch (error) {
            setCreateError(error instanceof Error ? error.message : `Failed to ${modalMode === 'edit' ? 'update' : 'create'} class.`)
            throw error
          }
        }}
      />

      <ConfirmActionModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        title="Delete Class"
        description={`Are you sure you want to delete ${selectedClass?.name ?? 'this class'}?`}
        confirmLabel="OK"
        cancelLabel="Cancel"
        isSubmitting={deleteMutation.isPending}
        onConfirm={async () => {
          if (!selectedClass) return
          try {
            await deleteMutation.mutateAsync(selectedClass.id)
            setDeleteError('')
          } catch (error) {
            setDeleteError(error instanceof Error ? error.message : 'Failed to delete class.')
            throw error
          }
        }}
      />
    </div>
  )
}
