import { useState } from 'react'
import {
  GraduationCap,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  BookOpen,
  Layers,
  Link as LinkIcon,
  ChevronDown,
  ChevronUp,
  Clock,
  Loader2,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { ConfirmActionModal } from '@/components/modal/academics/ConfirmActionModal'
import { SubjectMappingModal } from '@/components/modal/academics/SubjectMappingModal'
import { useDeleteSubjectMappingMutation, useSubjectMappingsQuery } from '@/hooks/useSubjectMappingMutation'
import type { SubjectMappingRecord } from '@/services/subjectMapping'

function getTypeColor(type: string) {
  const t = type?.toLowerCase()
  if (t === 'core') return 'bg-blue-100 text-blue-700 border-blue-200'
  if (t === 'elective') return 'bg-purple-100 text-purple-700 border-purple-200'
  if (t === 'language') return 'bg-green-100 text-green-700 border-green-200'
  if (t === 'skill') return 'bg-orange-100 text-orange-700 border-orange-200'
  if (t === 'co-curricular') return 'bg-pink-100 text-pink-700 border-pink-200'
  if (t === 'mandatory') return 'bg-red-100 text-red-700 border-red-200'
  if (t === 'optional') return 'bg-gray-100 text-gray-700 border-gray-200'
  return 'bg-gray-100 text-gray-700 border-gray-200'
}

export function SubjectMappingPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editRecord, setEditRecord] = useState<SubjectMappingRecord | null>(null)
  const [deleteRecord, setDeleteRecord] = useState<SubjectMappingRecord | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterClass, setFilterClass] = useState('all')
  const [showFilters, setShowFilters] = useState(false)
  const [expandedClasses, setExpandedClasses] = useState<Set<number>>(new Set())

  const { data: mappings = [], isLoading, isError } = useSubjectMappingsQuery()
  const deleteMutation = useDeleteSubjectMappingMutation()

  const toggleClassExpand = (classId: number) => {
    const next = new Set(expandedClasses)
    next.has(classId) ? next.delete(classId) : next.add(classId)
    setExpandedClasses(next)
  }

  // Unique class ids for filter dropdown
  const uniqueClasses = Array.from(
    new Map(mappings.map((m) => [m.classId, { id: m.classId, name: m.className, code: m.classCode }])).values()
  )

  const filteredMappings = mappings.filter((m) => {
    const q = searchTerm.toLowerCase()
    const matchesSearch =
      m.subjectName.toLowerCase().includes(q) ||
      m.className.toLowerCase().includes(q) ||
      m.termName.toLowerCase().includes(q)
    const matchesClass = filterClass === 'all' || m.classId === Number(filterClass)
    return matchesSearch && matchesClass
  })

  const mappingsByClass = filteredMappings.reduce(
    (acc, m) => {
      const key = m.classId
      if (!acc[key]) acc[key] = { classId: m.classId, className: m.className, classCode: m.classCode, mappings: [] }
      acc[key].mappings.push(m)
      return acc
    },
    {} as Record<number, { classId: number; className: string; classCode: string; mappings: SubjectMappingRecord[] }>,
  )

  const totalMappings = mappings.length
  const totalClasses = Object.keys(mappingsByClass).length
  const avgSubjectsPerClass = totalClasses > 0 ? Math.round(totalMappings / totalClasses) : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Subject Mapping</h1>
          <p className="text-sm text-gray-500 mt-2">Map subjects to classes and assign teachers</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/academics/subjectEntry"
            className="px-5 py-2.5 bg-white/60 backdrop-blur border border-white/30 rounded-xl font-medium text-gray-700 hover:bg-white/80 transition-all flex items-center gap-2 shadow-sm text-sm"
          >
            <BookOpen size={16} />
            Subject Master
          </Link>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2 text-sm"
          >
            <Plus size={16} />
            Map Subject
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Mappings', value: totalMappings, sub: 'Subject-Class pairs', icon: LinkIcon, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Classes Mapped', value: totalClasses, sub: 'Total classes', icon: GraduationCap, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Avg Subjects', value: avgSubjectsPerClass, sub: 'Per class', icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Unique Subjects', value: new Set(mappings.map((m) => m.subjectId)).size, sub: 'Available', icon: Layers, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        ].map((s) => (
          <div key={s.label} className="bg-white/40 backdrop-blur-xl rounded-2xl border border-white/20 shadow-lg p-5 hover:bg-white/60 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-1">{s.label}</p>
                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-xs text-gray-400 mt-1">{s.sub}</p>
              </div>
              <div className={`w-11 h-11 ${s.bg} rounded-xl flex items-center justify-center`}>
                <s.icon size={22} className={s.color} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Search & Filters */}
      <div className="bg-white/40 backdrop-blur-xl rounded-2xl border border-white/20 shadow-lg p-5">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by subject, class, or term..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-white/50 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-5 py-2.5 bg-white/50 border border-white/30 rounded-xl font-medium text-gray-700 hover:bg-white/80 transition-all flex items-center gap-2 text-sm"
          >
            <Filter size={16} />
            Filters
          </button>
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-white/30">
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Filter by Class</label>
            <select
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
              className="w-full md:w-72 px-4 py-2.5 bg-white/50 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm"
            >
              <option value="all">All Classes</option>
              {uniqueClasses.map((cls) => (
                <option key={cls.id} value={cls.id}>{cls.name}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 size={32} className="animate-spin text-indigo-500" />
        </div>
      )}

      {/* Error */}
      {isError && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center text-red-600 text-sm font-medium">
          Failed to load subject mappings. Please try again.
        </div>
      )}

      {/* Mappings grouped by class */}
      {!isLoading && !isError && (
        <div className="space-y-4">
          {Object.entries(mappingsByClass).map(([, { classId, className, classCode, mappings: clsMappings }]) => {
            const isExpanded = expandedClasses.has(classId)
            return (
              <div key={classId} className="bg-white/40 backdrop-blur-xl rounded-2xl border border-white/20 shadow-lg overflow-hidden">
                <button
                  onClick={() => toggleClassExpand(classId)}
                  className="w-full bg-gradient-to-r from-indigo-50/80 to-purple-50/80 px-6 py-5 flex items-center justify-between hover:from-indigo-100/80 hover:to-purple-100/80 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                      {classCode || className.slice(0, 3).toUpperCase()}
                    </div>
                    <div className="text-left">
                      <h3 className="text-lg font-bold text-gray-800">{className}</h3>
                      <p className="text-sm text-gray-500">
                        {clsMappings.length} subjects mapped &bull; {clsMappings.reduce((s, m) => s + m.periodsPerWeek, 0)} periods/week
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1.5 bg-white/70 rounded-lg text-sm font-semibold text-gray-700 border border-white/40">
                      {clsMappings.length} Subjects
                    </span>
                    {isExpanded ? <ChevronUp size={18} className="text-gray-500" /> : <ChevronDown size={18} className="text-gray-500" />}
                  </div>
                </button>

                {isExpanded && (
                  <div className="p-5 space-y-3 bg-gray-50/40">
                    {clsMappings.map((mapping) => (
                      <div key={mapping.subjectMappingId} className="bg-white/60 backdrop-blur rounded-xl border border-white/30 p-5 hover:bg-white/80 transition-all">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2 mb-3">
                              <div className="w-9 h-9 bg-indigo-100 rounded-lg flex items-center justify-center shrink-0">
                                <BookOpen size={16} className="text-indigo-600" />
                              </div>
                              <div>
                                <h4 className="font-bold text-gray-800">{mapping.subjectName}</h4>
                                <p className="text-xs font-semibold text-indigo-600">{mapping.subjectCode}</p>
                              </div>
                              {mapping.subjectType && (
                                <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${getTypeColor(mapping.subjectType)}`}>
                                  {mapping.subjectType}
                                </span>
                              )}
                              {mapping.isAllSections && (
                                <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200">
                                  All Sections
                                </span>
                              )}
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Clock size={14} className="text-blue-500 shrink-0" />
                                <div>
                                  <p className="text-xs text-gray-400">Periods / Week</p>
                                  <p className="font-medium text-gray-700">{mapping.periodsPerWeek}</p>
                                </div>
                              </div>
                              {mapping.termName && (
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <Layers size={14} className="text-purple-500 shrink-0" />
                                  <div>
                                    <p className="text-xs text-gray-400">Term</p>
                                    <p className="font-medium text-gray-700">{mapping.termName}</p>
                                  </div>
                                </div>
                              )}
                              {mapping.sectionName && !mapping.isAllSections && (
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <GraduationCap size={14} className="text-amber-500 shrink-0" />
                                  <div>
                                    <p className="text-xs text-gray-400">Section</p>
                                    <p className="font-medium text-gray-700">{mapping.sectionName}</p>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              onClick={() => { setEditRecord(mapping); setIsModalOpen(true) }}
                              className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-all"
                            >
                              <Edit size={15} />
                            </button>
                            <button
                              onClick={() => setDeleteRecord(mapping)}
                              className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !isError && Object.keys(mappingsByClass).length === 0 && (
        <div className="bg-white/40 backdrop-blur-xl rounded-2xl border border-white/20 shadow-lg p-12 text-center">
          <LinkIcon size={56} className="text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">No mappings found</h3>
          <p className="text-gray-500 mb-6">Start by mapping subjects to classes</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-all inline-flex items-center gap-2"
          >
            <Plus size={18} />
            Create First Mapping
          </button>
        </div>
      )}

      <SubjectMappingModal
        open={isModalOpen}
        onOpenChange={(v) => { setIsModalOpen(v); if (!v) setEditRecord(null) }}
        editRecord={editRecord}
      />

      <ConfirmActionModal
        open={!!deleteRecord}
        onOpenChange={(v) => { if (!v) setDeleteRecord(null) }}
        title="Delete Subject Mapping"
        description={`Are you sure you want to delete the mapping for "${deleteRecord?.subjectName}"? This action cannot be undone.`}
        confirmLabel="Delete"
        isSubmitting={deleteMutation.isPending}
        onConfirm={async () => {
          if (deleteRecord) await deleteMutation.mutateAsync(deleteRecord.subjectMappingId)
          setDeleteRecord(null)
        }}
      />
    </div>
  )
}
