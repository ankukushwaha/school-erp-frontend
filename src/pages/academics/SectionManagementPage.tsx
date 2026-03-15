import { SectionUpsertModal, type SectionFormPayload } from '@/components/modal/academics/SectionUpsertModal'
import {
  ArrowLeft,
  Boxes,
  Edit2,
  Filter,
  Layers,
  Plus,
  Search,
  Trash2,
  Users,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

type SchoolClass = {
  id: number
  name: string
}

type Section = {
  id: number
  name: string
  classId: number
  className: string
  roomNumber: string
  floor: string
  classTeacher: string
  capacity: number
  currentStudents: number
}

const mockClasses: SchoolClass[] = [
  { id: 1, name: 'Nursery' },
  { id: 2, name: 'LKG' },
  { id: 3, name: 'UKG' },
  { id: 4, name: 'Class 1' },
  { id: 5, name: 'Class 2' },
  { id: 6, name: 'Class 3' },
]

const mockSections: Section[] = [
  { id: 1, name: 'A', classId: 1, className: 'Nursery', roomNumber: '101', floor: 'Ground Floor', classTeacher: 'Mrs. Emily', capacity: 30, currentStudents: 24 },
  { id: 2, name: 'B', classId: 1, className: 'Nursery', roomNumber: '102', floor: 'Ground Floor', classTeacher: 'Mrs. Sarah', capacity: 30, currentStudents: 30 },
  { id: 3, name: 'A', classId: 4, className: 'Class 1', roomNumber: '201', floor: '1st Floor', classTeacher: 'Ms. Anderson', capacity: 35, currentStudents: 32 },
  { id: 4, name: 'B', classId: 4, className: 'Class 1', roomNumber: '202', floor: '1st Floor', classTeacher: 'Mr. Brown', capacity: 35, currentStudents: 28 },
]

export function SectionManagementPage() {
  const navigate = useNavigate()

  const [sections, setSections] = useState<Section[]>(mockSections)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedClassFilter, setSelectedClassFilter] = useState('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
  const [editingSection, setEditingSection] = useState<Section | null>(null)

  const filteredSections = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()
    return sections.filter((sec) => {
      const matchesClass = selectedClassFilter === 'all' || String(sec.classId) === selectedClassFilter
      const matchesSearch =
        query.length === 0 ||
        sec.name.toLowerCase().includes(query) ||
        sec.className.toLowerCase().includes(query) ||
        sec.classTeacher.toLowerCase().includes(query)
      return matchesClass && matchesSearch
    })
  }, [searchTerm, sections, selectedClassFilter])

  const totalSections = filteredSections.length
  const totalStudents = filteredSections.reduce((acc, sec) => acc + sec.currentStudents, 0)
  const totalCapacity = filteredSections.reduce((acc, sec) => acc + sec.capacity, 0)
  const avgOccupancy = totalCapacity > 0 ? Math.round((totalStudents / totalCapacity) * 100) : 0

  const getOccupancyColor = (current: number, max: number) => {
    const ratio = max > 0 ? current / max : 0
    if (ratio >= 0.9) return 'bg-red-100 text-red-700'
    if (ratio >= 0.7) return 'bg-amber-100 text-amber-700'
    return 'bg-emerald-100 text-emerald-700'
  }

  const editSection = (section: Section) => {
    setModalMode('edit')
    setEditingSection(section)
    setIsModalOpen(true)
  }

  const deleteSection = (sectionId: number) => {
    if (!window.confirm('Are you sure you want to delete this section?')) return
    setSections((prev) => prev.filter((sec) => sec.id !== sectionId))
  }

  const handleSubmit = (payload: SectionFormPayload) => {
    const classObj = mockClasses.find((cls) => cls.id === payload.classId)
    if (!classObj) return

    if (editingSection) {
      setSections((prev) =>
        prev.map((sec) =>
          sec.id === editingSection.id
            ? {
                ...sec,
                name: payload.sectionName,
                classId: payload.classId,
                className: classObj.name,
                roomNumber: payload.roomNumber,
                floor: payload.floor,
                classTeacher: payload.classTeacher,
                capacity: payload.capacity,
              }
            : sec,
        ),
      )
    } else {
      const newSection: Section = {
        id: Date.now(),
        name: payload.sectionName,
        classId: payload.classId,
        className: classObj.name,
        roomNumber: payload.roomNumber,
        floor: payload.floor,
        classTeacher: payload.classTeacher,
        capacity: payload.capacity,
        currentStudents: 0,
      }
      setSections((prev) => [...prev, newSection])
    }
    setEditingSection(null)
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/academics')} className="rounded-full bg-white/40 p-2 text-gray-600 transition-colors hover:bg-white/60">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-800">Section Management</h1>
            <p className="mt-1 text-sm text-gray-500">Manage sections by class, room, and teacher allocation</p>
          </div>
        </div>
        <button
          onClick={() => {
            setModalMode('create')
            setEditingSection(null)
            setIsModalOpen(true)
          }}
          className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 font-medium text-white shadow-lg shadow-indigo-600/30 transition-all hover:bg-indigo-700"
        >
          <Plus size={18} />
          Add New Section
        </button>
      </div>

      <div className="relative">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          <div className="rounded-2xl border border-white/20 bg-white/40 p-6 shadow-lg backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                <Layers size={22} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Sections</p>
                <p className="text-2xl font-bold text-gray-800">{totalSections}</p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-white/20 bg-white/40 p-6 shadow-lg backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                <Users size={22} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Students</p>
                <p className="text-2xl font-bold text-gray-800">{totalStudents}</p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-white/20 bg-white/40 p-6 shadow-lg backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
                <Boxes size={22} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Capacity</p>
                <p className="text-2xl font-bold text-gray-800">{totalCapacity}</p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-white/20 bg-white/40 p-6 shadow-lg backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                <Filter size={22} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Avg Occupancy</p>
                <p className="text-2xl font-bold text-gray-800">{avgOccupancy}%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-5">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search sections by name, class, or teacher..."
            className="w-full rounded-2xl border border-white/30 bg-white/50 py-3 pl-12 pr-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
        <div className="w-56">
          <select
            value={selectedClassFilter}
            onChange={(event) => setSelectedClassFilter(event.target.value)}
            className="w-full appearance-none rounded-2xl border border-white/30 bg-white/50 px-4 py-3 font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="all">All Classes</option>
            {mockClasses.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="flex-1">
          <div className="overflow-hidden rounded-2xl border border-white/20 bg-white/40 shadow-lg backdrop-blur-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-gray-100 bg-gray-50/50 text-xs uppercase text-gray-500">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold">Section</th>
                    <th className="px-6 py-4 text-left font-semibold">Class</th>
                    <th className="px-6 py-4 text-left font-semibold">Room No</th>
                    <th className="px-6 py-4 text-left font-semibold">Floor</th>
                    <th className="px-6 py-4 text-left font-semibold">Class Teacher</th>
                    <th className="px-6 py-4 text-left font-semibold">Capacity</th>
                    <th className="px-6 py-4 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredSections.map((sec) => (
                    <tr key={sec.id} className="transition-colors hover:bg-white/40">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 font-bold text-emerald-600">{sec.name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-800">{sec.className}</td>
                      <td className="px-6 py-4 text-gray-600">{sec.roomNumber}</td>
                      <td className="px-6 py-4 text-gray-600">{sec.floor}</td>
                      <td className="px-6 py-4 text-gray-600">{sec.classTeacher}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className={`rounded-full px-3 py-1 text-xs font-medium ${getOccupancyColor(sec.currentStudents, sec.capacity)}`}>
                            {sec.currentStudents} / {sec.capacity}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-4">
                          <button
                            onClick={() => editSection(sec)}
                            className="rounded-md p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-indigo-600"
                            aria-label={`Edit section ${sec.name}`}
                          >
                            <Edit2 size={15} />
                          </button>
                          <button
                            onClick={() => deleteSection(sec.id)}
                            className="rounded-md p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-red-600"
                            aria-label={`Delete section ${sec.name}`}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>

      {isModalOpen ? (
        <SectionUpsertModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          mode={modalMode}
          classOptions={mockClasses}
          initialValues={
            editingSection
              ? {
                  sectionName: editingSection.name,
                  classId: editingSection.classId,
                  roomNumber: editingSection.roomNumber,
                  floor: editingSection.floor,
                  capacity: editingSection.capacity,
                  classTeacher: editingSection.classTeacher,
                }
              : null
          }
          onSubmit={handleSubmit}
        />
      ) : null}
    </div>
  )
}
