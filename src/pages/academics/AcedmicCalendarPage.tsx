import {
  ArrowLeft,
  Calendar,
  ChevronDown,
  Download,
  Edit2,
  FileText,
  Flag,
  GraduationCap,
  Plus,
  Save,
  Search,
  Trash2,
} from 'lucide-react'
import { COMMON_SEARCH_CONFIGS } from '@/app/constants/commonSearchConfigs'
import { CommonSearchTextbox } from '@/components/common/CommonSearchTextbox'
import { ConfirmActionModal } from '@/components/modal/academics/ConfirmActionModal'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { type FormEventHandler, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

type CalendarEvent = {
  id: number
  title: string
  type: string
  academicYear: string
  className: string
  startDate: string
  endDate: string
  description: string
  classes: string[]
}

const eventTypes = ['Holiday', 'Exam', 'Event', 'Meeting', 'Sports']

const mockEvents: CalendarEvent[] = [
  {
    id: 1,
    title: 'Independence Day',
    type: 'Holiday',
    academicYear: '2024-2025',
    className: 'All',
    startDate: '2024-08-15',
    endDate: '2024-08-15',
    description: 'National Holiday',
    classes: ['All'],
  },
  {
    id: 2,
    title: 'Mid-Term Exams',
    type: 'Exam',
    academicYear: '2024-2025',
    className: 'Class 9',
    startDate: '2024-09-10',
    endDate: '2024-09-20',
    description: 'Half-yearly examinations',
    classes: ['Class 9', 'Class 10', 'Class 11', 'Class 12'],
  },
  {
    id: 3,
    title: 'Gandhi Jayanti',
    type: 'Holiday',
    academicYear: '2024-2025',
    className: 'All',
    startDate: '2024-10-02',
    endDate: '2024-10-02',
    description: 'National Holiday',
    classes: ['All'],
  },
  {
    id: 4,
    title: 'Annual Sports Day',
    type: 'Sports',
    academicYear: '2024-2025',
    className: 'All',
    startDate: '2024-11-15',
    endDate: '2024-11-17',
    description: 'Inter-house sports competition',
    classes: ['All'],
  },
  {
    id: 5,
    title: 'Parent-Teacher Meeting',
    type: 'Meeting',
    academicYear: '2024-2025',
    className: 'All',
    startDate: '2024-11-25',
    endDate: '2024-11-25',
    description: 'Quarterly PTM',
    classes: ['All'],
  },
  {
    id: 6,
    title: 'Winter Break',
    type: 'Holiday',
    academicYear: '2024-2025',
    className: 'All',
    startDate: '2024-12-24',
    endDate: '2025-01-05',
    description: 'Winter vacation',
    classes: ['All'],
  },
  {
    id: 7,
    title: 'Annual Day Celebration',
    type: 'Event',
    academicYear: '2024-2025',
    className: 'All',
    startDate: '2025-01-26',
    endDate: '2025-01-26',
    description: 'Republic Day celebration',
    classes: ['All'],
  },
  {
    id: 8,
    title: 'Final Exams',
    type: 'Exam',
    academicYear: '2024-2025',
    className: 'All',
    startDate: '2025-03-01',
    endDate: '2025-03-15',
    description: 'Annual examinations',
    classes: ['All'],
  },
]

const getTypeColor = (type: string) => {
  switch (type) {
    case 'Holiday':
      return 'bg-red-100 text-red-700 border-red-200'
    case 'Exam':
      return 'bg-indigo-100 text-indigo-700 border-indigo-200'
    case 'Event':
      return 'bg-purple-100 text-purple-700 border-purple-200'
    case 'Meeting':
      return 'bg-emerald-100 text-emerald-700 border-emerald-200'
    case 'Sports':
      return 'bg-amber-100 text-amber-700 border-amber-200'
    default:
      return 'bg-gray-100 text-gray-700 border-gray-200'
  }
}

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'Holiday':
      return <Flag size={18} />
    case 'Exam':
      return <FileText size={18} />
    case 'Event':
      return <Calendar size={18} />
    case 'Meeting':
      return <GraduationCap size={18} />
    case 'Sports':
      return <Flag size={18} />
    default:
      return <Calendar size={18} />
  }
}

const formatDateRange = (start: string, end: string) => {
  const startDate = new Date(start)
  const endDate = new Date(end)

  if (start === end) {
    return startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  return `${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
}

export function AcedmicCalendarPage() {
  const navigate = useNavigate()
  const [events, setEvents] = useState<CalendarEvent[]>(mockEvents)
  const [showForm, setShowForm] = useState(false)
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null)
  const [eventToDelete, setEventToDelete] = useState<CalendarEvent | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')

  const [title, setTitle] = useState('')
  const [type, setType] = useState('')
  const [academicYear, setAcademicYear] = useState('')
  const [className, setClassName] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [description, setDescription] = useState('')
  const [selectedClasses, setSelectedClasses] = useState<string[]>(['All'])

  const resetForm = () => {
    setTitle('')
    setType('')
    setAcademicYear('')
    setClassName('')
    setStartDate('')
    setEndDate('')
    setDescription('')
    setSelectedClasses(['All'])
    setShowForm(false)
    setEditingEvent(null)
  }

  const openCreateModal = () => {
    setEditingEvent(null)
    setTitle('')
    setType('')
    setAcademicYear('')
    setClassName('')
    setStartDate('')
    setEndDate('')
    setDescription('')
    setSelectedClasses(['All'])
    setShowForm(true)
  }

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault()

    if (editingEvent) {
      setEvents((prev) =>
        prev.map((evt) =>
          evt.id === editingEvent.id
            ? { ...evt, title, type, academicYear, className, startDate, endDate, description, classes: selectedClasses }
            : evt,
        ),
      )
      resetForm()
      return
    }

    const newEvent: CalendarEvent = {
      id: Date.now(),
      title,
      type,
      academicYear,
      className,
      startDate,
      endDate,
      description,
      classes: selectedClasses,
    }
    setEvents((prev) => [...prev, newEvent].sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()))
    resetForm()
  }

  const editEvent = (evt: CalendarEvent) => {
    setEditingEvent(evt)
    setTitle(evt.title)
    setType(evt.type)
    setAcademicYear(evt.academicYear)
    setClassName(evt.className)
    setStartDate(evt.startDate)
    setEndDate(evt.endDate)
    setDescription(evt.description)
    setSelectedClasses(evt.classes)
    setShowForm(true)
  }

  const openDeleteModal = (evt: CalendarEvent) => {
    setEventToDelete(evt)
    setIsDeleteModalOpen(true)
  }

  const deleteEvent = () => {
    if (!eventToDelete) return
    setEvents((prev) => prev.filter((evt) => evt.id !== eventToDelete.id))
    setEventToDelete(null)
  }

  const filteredEvents = useMemo(() => {
    return events.filter((evt) => {
      const matchesSearch =
        evt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        evt.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesType = filterType === 'all' || evt.type === filterType
      return matchesSearch && matchesType
    })
  }, [events, filterType, searchTerm])

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/academics')}
            className="rounded-full bg-white/40 p-2 text-gray-600 transition-colors hover:bg-white/60"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-800">Academic Calendar</h1>
            <p className="mt-1 text-sm text-gray-500">Manage holidays, events, exams, and meetings</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 rounded-xl border border-white/30 bg-white/50 px-4 py-2.5 text-sm font-medium text-gray-700 transition-all hover:bg-white">
            <Download size={18} />
            Export PDF
          </button>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 font-medium text-white shadow-lg shadow-indigo-600/30 transition-all hover:bg-indigo-700"
          >
            <Plus size={18} />
            Add Event
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-5">
        <div className="rounded-2xl border border-white/20 bg-white/40 p-6 shadow-lg backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 text-red-600">
              <Flag size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-500">Holidays</p>
              <p className="text-xl font-bold text-gray-800">{events.filter((item) => item.type === 'Holiday').length}</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-white/20 bg-white/40 p-6 shadow-lg backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
              <FileText size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-500">Exams</p>
              <p className="text-xl font-bold text-gray-800">{events.filter((item) => item.type === 'Exam').length}</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-white/20 bg-white/40 p-6 shadow-lg backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
              <Calendar size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-500">Events</p>
              <p className="text-xl font-bold text-gray-800">{events.filter((item) => item.type === 'Event').length}</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-white/20 bg-white/40 p-6 shadow-lg backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
              <GraduationCap size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-500">Meetings</p>
              <p className="text-xl font-bold text-gray-800">{events.filter((item) => item.type === 'Meeting').length}</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-white/20 bg-white/40 p-6 shadow-lg backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
              <Flag size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-500">Sports</p>
              <p className="text-xl font-bold text-gray-800">{events.filter((item) => item.type === 'Sports').length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search events by title or description..."
            className="w-full rounded-xl border border-white/30 bg-white/50 py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
        <div className="relative">
          <select
            value={filterType}
            onChange={(event) => setFilterType(event.target.value)}
            className="min-w-[200px] appearance-none rounded-xl border border-white/30 bg-white/50 py-3 pl-4 pr-10 font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="all">All Types</option>
            {eventTypes.map((eventType) => (
              <option key={eventType} value={eventType}>
                {eventType}
              </option>
            ))}
          </select>
          <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" />
        </div>
      </div>

      <div className="space-y-4">
        {filteredEvents.map((evt) => (
          <div
            key={evt.id}
            className={`rounded-2xl border-2 ${getTypeColor(evt.type)} bg-white/40 p-6 shadow-lg transition-all hover:bg-white/60 backdrop-blur-xl`}
          >
            <div className="mb-4 flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${getTypeColor(evt.type)}`}>
                  {getTypeIcon(evt.type)}
                </div>
                <div>
                  <h3 className="mb-1 text-lg font-bold text-gray-800">{evt.title}</h3>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Calendar size={14} />
                      {formatDateRange(evt.startDate, evt.endDate)}
                    </span>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${getTypeColor(evt.type)}`}>{evt.type}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => editEvent(evt)}
                  className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-white hover:text-indigo-600"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => openDeleteModal(evt)}
                  className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-white hover:text-red-600"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <p className="mb-3 text-sm text-gray-600">{evt.description}</p>
            <div className="flex items-center gap-2 text-xs">
              <span className="font-bold text-gray-500">Applicable to:</span>
              {evt.classes.map((cls) => (
                <span key={cls} className="rounded-md bg-white/60 px-2 py-1 text-gray-700">
                  {cls}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Dialog
        open={showForm}
        onOpenChange={(open) => {
          if (!open) {
            resetForm()
            return
          }
          setShowForm(true)
        }}
      >
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto border-white/20 bg-white/95 p-6 sm:rounded-2xl">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-800">{editingEvent ? 'Edit Event' : 'Add New Event'}</h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-gray-500">
                  Event Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="e.g. Independence Day"
                  className="w-full rounded-xl border border-white/30 bg-white/50 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-gray-500">
                  Event Type <span className="text-red-500">*</span>
                </label>
                <CommonSearchTextbox
                  searchConfig={COMMON_SEARCH_CONFIGS.eventType}
                  value={type}
                  onChange={setType}
                  placeholder="Search event type..."
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-gray-500">
                    Academic Year <span className="text-red-500">*</span>
                  </label>
                  <CommonSearchTextbox
                    searchConfig={COMMON_SEARCH_CONFIGS.academicYear}
                    value={academicYear}
                    onChange={setAcademicYear}
                    placeholder="Search academic year..."
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-gray-500">
                    Class Name <span className="text-red-500">*</span>
                  </label>
                  <CommonSearchTextbox
                    searchConfig={COMMON_SEARCH_CONFIGS.className}
                    value={className}
                    onChange={setClassName}
                    placeholder="Search class name..."
                    required
                  />
                </div>
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

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-gray-500">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="Event description..."
                  rows={3}
                  className="w-full resize-none rounded-xl border border-white/30 bg-white/50 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-gray-500">Applicable Classes</label>
                <div className="rounded-xl border border-white/30 bg-white/40 p-3">
                  <label className="mb-2 flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedClasses.includes('All')}
                      onChange={(event) => {
                        if (event.target.checked) {
                          setSelectedClasses(['All'])
                          return
                        }
                        setSelectedClasses([])
                      }}
                      className="rounded"
                    />
                    <span className="text-sm text-gray-700">All Classes</span>
                  </label>
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
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 py-2.5 text-sm font-medium text-white shadow-lg shadow-indigo-600/30 transition-all hover:bg-indigo-700"
                >
                  <Save size={18} />
                  {editingEvent ? 'Update' : 'Create'}
                </button>
              </div>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmActionModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        title="Delete Event"
        description={`Are you sure you want to delete ${eventToDelete?.title ?? 'this event'}?`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={deleteEvent}
      />
    </div>
  )
}
