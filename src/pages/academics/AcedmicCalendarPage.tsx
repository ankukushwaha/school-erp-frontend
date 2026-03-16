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
import {
  useAcademicCalendarQuery,
  useCreateAcademicCalendarMutation,
  useDeleteAcademicCalendarMutation,
  useUpdateAcademicCalendarMutation,
} from '@/hooks/useAcademicCalendarMutation'
import { useAcademicYearsQuery } from '@/hooks/useAcademicYearsQuery'
import { useClassesQuery } from '@/hooks/useClassesQuery'
import { useSchoolQuery } from '@/hooks/useSchoolQuery'
import { ConfirmActionModal } from '@/components/modal/academics/ConfirmActionModal'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import type { CommonSearchItem } from '@/services/commonSearch'
import { type FormEventHandler, type ReactNode, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

type CalendarEvent = {
  id: number
  title: string
  type: string
  typeId?: number | null
  academicYear: string
  academicYearId?: number | null
  schoolId?: number
  className: string
  classIds?: number[]
  startDate: string
  endDate: string
  description: string
  classes: string[]
}

const eventTypes = ['Holiday', 'Exam', 'Event', 'Meeting', 'Sports']
const initialSelectedClasses = ['All']

const eventTypeStyles: Record<string, { badge: string; icon: ReactNode }> = {
  Holiday: {
    badge: 'bg-red-100 text-red-700 border-red-200',
    icon: <Flag size={18} />,
  },
  Exam: {
    badge: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    icon: <FileText size={18} />,
  },
  Event: {
    badge: 'bg-purple-100 text-purple-700 border-purple-200',
    icon: <Calendar size={18} />,
  },
  Meeting: {
    badge: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    icon: <GraduationCap size={18} />,
  },
  Sports: {
    badge: 'bg-amber-100 text-amber-700 border-amber-200',
    icon: <Flag size={18} />,
  },
}

const summaryCards = [
  { type: 'Holiday', label: 'Holidays', icon: <Flag size={20} />, iconClassName: 'bg-red-100 text-red-600' },
  { type: 'Exam', label: 'Exams', icon: <FileText size={20} />, iconClassName: 'bg-indigo-100 text-indigo-600' },
  { type: 'Event', label: 'Events', icon: <Calendar size={20} />, iconClassName: 'bg-purple-100 text-purple-600' },
  { type: 'Meeting', label: 'Meetings', icon: <GraduationCap size={20} />, iconClassName: 'bg-emerald-100 text-emerald-600' },
  { type: 'Sports', label: 'Sports', icon: <Flag size={20} />, iconClassName: 'bg-amber-100 text-amber-600' },
] as const

function getDefaultEventStyle() {
  return {
    badge: 'bg-gray-100 text-gray-700 border-gray-200',
    icon: <Calendar size={18} />,
  }
}

const getTypeColor = (type: string) => {
  return eventTypeStyles[type]?.badge ?? getDefaultEventStyle().badge
}

const getTypeIcon = (type: string) => {
  return eventTypeStyles[type]?.icon ?? getDefaultEventStyle().icon
}

const formatDateRange = (start: string, end: string) => {
  const startDate = new Date(start)
  const endDate = new Date(end)

  if (start === end) {
    return startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  return `${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
}

function normalizeSelectedClasses(selectedClasses: string[]) {
  return selectedClasses.includes('All') ? ['All'] : selectedClasses
}

function buildGroupedEvents(academicCalendar: ReturnType<typeof useAcademicCalendarQuery>['data'] = []): CalendarEvent[] {
  const groupedEvents = new Map<string, CalendarEvent>()

  academicCalendar.forEach((record) => {
    const groupKey = [
      record.academicYearId,
      record.schoolId,
      record.eventTypeId,
      record.eventTitle,
      record.eventDescription,
      record.startDate,
      record.endDate,
      record.isAllClasses ? 'all' : 'selected',
    ].join('|')

    const existingEvent = groupedEvents.get(groupKey)
    if (existingEvent) {
      if (!record.isAllClasses && !existingEvent.classes.includes(record.className)) {
        existingEvent.classes.push(record.className)
      }
      if (!record.isAllClasses && !existingEvent.classIds?.includes(record.classId)) {
        existingEvent.classIds = [...(existingEvent.classIds ?? []), record.classId]
      }
      return
    }

    groupedEvents.set(groupKey, {
      id: record.academicCalendarId,
      title: record.eventTitle,
      type: record.eventTypeName,
      typeId: record.eventTypeId,
      academicYear: record.academicYearName,
      academicYearId: record.academicYearId,
      schoolId: record.schoolId,
      className: record.isAllClasses ? 'All' : record.className,
      classIds: [record.classId],
      startDate: record.startDate,
      endDate: record.endDate,
      description: record.eventDescription,
      classes: record.isAllClasses ? ['All'] : [record.className],
    })
  })

  return Array.from(groupedEvents.values()).sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
}

export function AcedmicCalendarPage() {
  const navigate = useNavigate()
  const { data: schools = [] } = useSchoolQuery()
  const { data: academicYears = [] } = useAcademicYearsQuery()
  const { data: classes = [], isLoading: isClassesLoading, isError: isClassesError } = useClassesQuery()
  const { data: academicCalendar = [], isLoading: isAcademicCalendarLoading, isError: isAcademicCalendarError } = useAcademicCalendarQuery()
  const createAcademicCalendarMutation = useCreateAcademicCalendarMutation()
  const updateAcademicCalendarMutation = useUpdateAcademicCalendarMutation()
  const deleteAcademicCalendarMutation = useDeleteAcademicCalendarMutation()
  const [showForm, setShowForm] = useState(false)
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null)
  const [eventToDelete, setEventToDelete] = useState<CalendarEvent | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')

  const [title, setTitle] = useState('')
  const [type, setType] = useState('')
  const [typeId, setTypeId] = useState<number | null>(null)
  const [academicYear, setAcademicYear] = useState('')
  const [academicYearId, setAcademicYearId] = useState<number | null>(null)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [description, setDescription] = useState('')
  const [selectedClasses, setSelectedClasses] = useState<string[]>(initialSelectedClasses)
  const [classSelectionError, setClassSelectionError] = useState('')
  const [submitError, setSubmitError] = useState('')
  const isMutating =
    createAcademicCalendarMutation.isPending ||
    updateAcademicCalendarMutation.isPending ||
    deleteAcademicCalendarMutation.isPending

  const clearFormState = () => {
    setTitle('')
    setType('')
    setTypeId(null)
    setAcademicYear('')
    setAcademicYearId(null)
    setStartDate('')
    setEndDate('')
    setDescription('')
    setSelectedClasses(initialSelectedClasses)
    setClassSelectionError('')
    setSubmitError('')
  }

  const resetForm = () => {
    clearFormState()
    setShowForm(false)
    setEditingEvent(null)
  }

  const openCreateModal = () => {
    setEditingEvent(null)
    clearFormState()
    setShowForm(true)
  }

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()
    setSubmitError('')
    const normalizedClasses = normalizeSelectedClasses(selectedClasses)

    if (normalizedClasses.length === 0) {
      setClassSelectionError('Select at least one class or choose All Classes.')
      return
    }

    if (new Date(endDate).getTime() < new Date(startDate).getTime()) {
      setSubmitError('End date cannot be earlier than start date.')
      return
    }

    const selectedClassRecords = classes.filter((schoolClass) => normalizedClasses.includes(schoolClass.name))
    const resolvedAcademicYearId = academicYearId ?? editingEvent?.academicYearId ?? null
    const resolvedTypeId = typeId ?? editingEvent?.typeId ?? null
    const resolvedSchoolId = editingEvent?.schoolId ?? schools[0]?.schoolId ?? 1

    if (!normalizedClasses.includes('All') && selectedClassRecords.length === 0) {
      setSubmitError('Select at least one valid class.')
      return
    }

    if (editingEvent) {
      if (!resolvedAcademicYearId) {
        setSubmitError('Select a valid academic year from the search list.')
        return
      }

      if (!resolvedTypeId) {
        setSubmitError('Select a valid event type from the search list.')
        return
      }

      const classId =
        normalizedClasses.includes('All')
          ? editingEvent.classIds?.[0] ?? classes[0]?.id ?? 1
          : selectedClassRecords[0]?.id ?? editingEvent.classIds?.[0]

      if (!classId) {
        setSubmitError('Select at least one valid class.')
        return
      }

      try {
        await updateAcademicCalendarMutation.mutateAsync({
          academicCalendarId: editingEvent.id,
          academicYearId: resolvedAcademicYearId,
          schoolId: resolvedSchoolId,
          classId,
          isAllClasses: normalizedClasses.includes('All'),
          eventTypeId: resolvedTypeId,
          eventTitle: title,
          eventDescription: description,
          startDate,
          endDate,
          isHoliday: type.trim().toLowerCase() === 'holiday',
        })
      } catch {
        setSubmitError('Failed to update event. Please try again.')
        return
      }

      resetForm()
      return
    }

    if (!resolvedAcademicYearId) {
      setSubmitError('Select a valid academic year from the search list.')
      return
    }

    if (!resolvedTypeId) {
      setSubmitError('Select a valid event type from the search list.')
      return
    }

    const requestClassIds = normalizedClasses.includes('All')
      ? [selectedClassRecords[0]?.id ?? classes[0]?.id ?? 1]
      : selectedClassRecords.map((schoolClass) => schoolClass.id)

    try {
      await Promise.all(
        requestClassIds.map((classId) =>
          createAcademicCalendarMutation.mutateAsync({
            academicYearId: resolvedAcademicYearId,
            schoolId: resolvedSchoolId,
            classId,
            isAllClasses: normalizedClasses.includes('All'),
            eventTypeId: resolvedTypeId,
            eventTitle: title,
            eventDescription: description,
            startDate,
            endDate,
            isHoliday: type.trim().toLowerCase() === 'holiday',
          }),
        ),
      )
    } catch {
      setSubmitError('Failed to create event. Please try again.')
      return
    }

    resetForm()
  }

  const editEvent = (evt: CalendarEvent) => {
    setEditingEvent(evt)
    setTitle(evt.title)
    setType(evt.type)
    setTypeId(evt.typeId ?? null)
    setAcademicYear(evt.academicYear)
    setAcademicYearId(evt.academicYearId ?? academicYears.find((item) => item.yearName === evt.academicYear)?.id ?? null)
    setStartDate(evt.startDate)
    setEndDate(evt.endDate)
    setDescription(evt.description)
    setSelectedClasses(evt.classes)
    setClassSelectionError('')
    setSubmitError('')
    setShowForm(true)
  }

  const openDeleteModal = (evt: CalendarEvent) => {
    setEventToDelete(evt)
    setIsDeleteModalOpen(true)
  }

  const deleteEvent = async () => {
    if (!eventToDelete) return
    try {
      await deleteAcademicCalendarMutation.mutateAsync(eventToDelete.id)
    } catch {
      setSubmitError('Failed to delete event. Please try again.')
      return
    }
    setEventToDelete(null)
    setIsDeleteModalOpen(false)
  }

  const events = useMemo(() => buildGroupedEvents(academicCalendar), [academicCalendar])

  const filteredEvents = useMemo(() => {
    return events.filter((evt) => {
      const matchesSearch =
        evt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        evt.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesType = filterType === 'all' || evt.type === filterType
      return matchesSearch && matchesType
    })
  }, [events, filterType, searchTerm])

  const classOptions = useMemo(() => classes.map((schoolClass) => schoolClass.name), [classes])
  const showClassSelection = !selectedClasses.includes('All')

  const handleAllClassesToggle = (checked: boolean) => {
    setClassSelectionError('')
    setSelectedClasses(checked ? initialSelectedClasses : [])
  }

  const handleClassToggle = (classOption: string, checked: boolean) => {
    setClassSelectionError('')
    setSelectedClasses((prev) => {
      const baseSelection = prev.includes('All') ? [] : prev
      if (checked) {
        return [...baseSelection, classOption]
      }
      return baseSelection.filter((item) => item !== classOption)
    })
  }

  const handleAcademicYearChange = (value: string) => {
    setAcademicYear(value)
    setAcademicYearId(null)
    setSubmitError('')
  }

  const handleAcademicYearSelect = (item: CommonSearchItem) => {
    const resolvedId = typeof item.id === 'number' ? item.id : Number(item.id)
    setAcademicYearId(Number.isNaN(resolvedId) ? null : resolvedId)
    setSubmitError('')
  }

  const handleEventTypeChange = (value: string) => {
    setType(value)
    setTypeId(null)
    setSubmitError('')
  }

  const handleEventTypeSelect = (item: CommonSearchItem) => {
    const resolvedId = typeof item.id === 'number' ? item.id : Number(item.id)
    setTypeId(Number.isNaN(resolvedId) ? null : resolvedId)
    setSubmitError('')
  }

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
        {summaryCards.map((card) => (
          <div key={card.type} className="rounded-2xl border border-white/20 bg-white/40 p-6 shadow-lg backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${card.iconClassName}`}>{card.icon}</div>
              <div>
                <p className="text-xs text-gray-500">{card.label}</p>
                <p className="text-xl font-bold text-gray-800">{events.filter((item) => item.type === card.type).length}</p>
              </div>
            </div>
          </div>
        ))}
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
        {isAcademicCalendarLoading ? (
          <div className="rounded-2xl border border-gray-200 bg-white/40 p-10 text-center shadow-lg backdrop-blur-xl">
            <p className="text-sm text-gray-500">Loading academic calendar...</p>
          </div>
        ) : null}
        {isAcademicCalendarError ? (
          <div className="rounded-2xl border border-red-200 bg-red-50/70 p-10 text-center shadow-lg backdrop-blur-xl">
            <p className="text-sm text-red-600">Failed to load academic calendar.</p>
          </div>
        ) : null}
        {!isAcademicCalendarLoading && !isAcademicCalendarError && filteredEvents.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white/40 p-10 text-center shadow-lg backdrop-blur-xl">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">
              <Calendar size={24} />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-gray-800">No events yet</h3>
            <p className="mt-2 text-sm text-gray-500">Create your first academic calendar event to see it here.</p>
          </div>
        ) : null}
        {!isAcademicCalendarLoading && !isAcademicCalendarError
          ? filteredEvents.map((evt) => (
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
          ))
          : null}
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
                  Academic Year <span className="text-red-500">*</span>
                </label>
                <CommonSearchTextbox
                  searchConfig={COMMON_SEARCH_CONFIGS.academicYear}
                  value={academicYear}
                  onChange={handleAcademicYearChange}
                  onSelect={handleAcademicYearSelect}
                  placeholder="Search academic year..."
                  required
                />
              </div>

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
                  onChange={handleEventTypeChange}
                  onSelect={handleEventTypeSelect}
                  placeholder="Search event type..."
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
                    min={startDate || undefined}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-gray-500">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="Event description..."
                  rows={3}
                  className="w-full resize-none rounded-xl border border-white/30 bg-white/50 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-gray-500">Applicable Classes</label>
                <div className="rounded-xl border border-white/30 bg-white/40 p-3">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedClasses.includes('All')}
                      onChange={(event) => handleAllClassesToggle(event.target.checked)}
                      className="rounded"
                    />
                    <span className="text-sm text-gray-700">All Classes</span>
                  </label>
                </div>
                {showClassSelection ? (
                  <div className="rounded-xl border border-white/30 bg-white/40 p-4">
                    <label className="text-xs font-bold uppercase text-gray-500">
                      Select Classes <span className="text-red-500">*</span>
                    </label>
                    {isClassesLoading ? <p className="mt-3 text-sm text-gray-500">Loading classes...</p> : null}
                    {isClassesError ? <p className="mt-3 text-sm text-red-600">Failed to load classes.</p> : null}
                    {!isClassesLoading && !isClassesError && classOptions.length === 0 ? (
                      <p className="mt-3 text-sm text-gray-500">No classes available.</p>
                    ) : null}
                    {!isClassesLoading && !isClassesError && classOptions.length > 0 ? (
                      <div className="mt-3 grid max-h-[200px] grid-cols-1 gap-3 overflow-y-auto sm:grid-cols-2 lg:grid-cols-3">
                        {classOptions.map((classOption) => {
                          const isSelected = selectedClasses.includes(classOption)
                          return (
                            <label
                              key={classOption}
                              className={`flex items-center justify-between rounded-lg border p-3 text-sm transition-colors ${
                                isSelected
                                  ? 'border-indigo-200 bg-indigo-50 text-indigo-700'
                                  : 'border-gray-200 bg-white/70 text-gray-700 hover:border-indigo-200'
                              }`}
                            >
                              <span className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={(event) => handleClassToggle(classOption, event.target.checked)}
                                  className="rounded"
                                />
                                {classOption}
                              </span>
                            </label>
                          )
                        })}
                      </div>
                    ) : null}
                  </div>
                ) : null}
                {classSelectionError ? <p className="text-xs text-red-600">{classSelectionError}</p> : null}
              </div>

              {submitError ? <p className="text-sm text-red-600">{submitError}</p> : null}

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  disabled={isMutating}
                  className="flex-1 rounded-xl border border-gray-200 bg-white py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isMutating}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 py-2.5 text-sm font-medium text-white shadow-lg shadow-indigo-600/30 transition-all hover:bg-indigo-700"
                >
                  <Save size={18} />
                  {createAcademicCalendarMutation.isPending || updateAcademicCalendarMutation.isPending
                    ? 'Saving...'
                    : editingEvent
                      ? 'Update'
                      : 'Create'}
                </button>
              </div>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmActionModal
        open={isDeleteModalOpen}
        onOpenChange={(open) => {
          setIsDeleteModalOpen(open)
          if (!open) {
            setEventToDelete(null)
          }
        }}
        title="Delete Event"
        description={`Are you sure you want to delete ${eventToDelete?.title ?? 'this event'}?`}
        confirmLabel={deleteAcademicCalendarMutation.isPending ? 'Deleting...' : 'Delete'}
        cancelLabel="Cancel"
        onConfirm={deleteEvent}
      />
    </div>
  )
}
