import React, { useState } from 'react'
import {
  GraduationCap,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Search,
  Filter,
  AlertCircle,
  BookOpen,
  Layers,
  Link as LinkIcon,
  ChevronDown,
  ChevronUp,
  User,
  Clock,
} from 'lucide-react'
import { Link } from 'react-router-dom'

interface SubjectMapping {
  id: string
  classId: string
  className: string
  classCode: string
  subjectId: string
  subjectCode: string
  subjectName: string
  subjectType: string
  assignedTeacher: string
  periodsPerWeek: number
  isMandatory: boolean
  isActive: boolean
}

interface ClassData {
  id: string
  code: string
  name: string
  mappedSubjects: number
}

interface SubjectData {
  id: string
  code: string
  name: string
  type: string
}

const classes: ClassData[] = [
  { id: '1', code: 'NUR', name: 'Nursery', mappedSubjects: 5 },
  { id: '2', code: 'LKG', name: 'LKG', mappedSubjects: 6 },
  { id: '3', code: 'UKG', name: 'UKG', mappedSubjects: 6 },
  { id: '4', code: 'CL1', name: 'Class 1', mappedSubjects: 8 },
  { id: '5', code: 'CL2', name: 'Class 2', mappedSubjects: 8 },
  { id: '6', code: 'CL6', name: 'Class 6', mappedSubjects: 10 },
  { id: '7', code: 'CL10', name: 'Class 10', mappedSubjects: 12 },
]

const subjects: SubjectData[] = [
  { id: '1', code: 'ENG', name: 'English', type: 'Core' },
  { id: '2', code: 'MATH', name: 'Mathematics', type: 'Core' },
  { id: '3', code: 'SCI', name: 'Science', type: 'Core' },
  { id: '4', code: 'SST', name: 'Social Studies', type: 'Core' },
  { id: '5', code: 'HIN', name: 'Hindi', type: 'Language' },
  { id: '6', code: 'SANS', name: 'Sanskrit', type: 'Language' },
  { id: '7', code: 'COMP', name: 'Computer Science', type: 'Skill' },
  { id: '8', code: 'PE', name: 'Physical Education', type: 'Co-Curricular' },
  { id: '9', code: 'ART', name: 'Art & Craft', type: 'Co-Curricular' },
  { id: '10', code: 'MUS', name: 'Music', type: 'Elective' },
]

const initialMappings: SubjectMapping[] = [
  { id: '1', classId: '4', className: 'Class 1', classCode: 'CL1', subjectId: '1', subjectCode: 'ENG', subjectName: 'English', subjectType: 'Core', assignedTeacher: 'Mrs. Priya Sharma', periodsPerWeek: 6, isMandatory: true, isActive: true },
  { id: '2', classId: '4', className: 'Class 1', classCode: 'CL1', subjectId: '2', subjectCode: 'MATH', subjectName: 'Mathematics', subjectType: 'Core', assignedTeacher: 'Mr. Rajesh Kumar', periodsPerWeek: 6, isMandatory: true, isActive: true },
  { id: '3', classId: '4', className: 'Class 1', classCode: 'CL1', subjectId: '3', subjectCode: 'SCI', subjectName: 'Science', subjectType: 'Core', assignedTeacher: 'Dr. Anita Verma', periodsPerWeek: 5, isMandatory: true, isActive: true },
  { id: '4', classId: '4', className: 'Class 1', classCode: 'CL1', subjectId: '5', subjectCode: 'HIN', subjectName: 'Hindi', subjectType: 'Language', assignedTeacher: 'Mrs. Sunita Patel', periodsPerWeek: 5, isMandatory: true, isActive: true },
  { id: '5', classId: '4', className: 'Class 1', classCode: 'CL1', subjectId: '8', subjectCode: 'PE', subjectName: 'Physical Education', subjectType: 'Co-Curricular', assignedTeacher: 'Mr. Vikram Singh', periodsPerWeek: 2, isMandatory: true, isActive: true },
  { id: '6', classId: '7', className: 'Class 10', classCode: 'CL10', subjectId: '1', subjectCode: 'ENG', subjectName: 'English', subjectType: 'Core', assignedTeacher: 'Dr. Meera Reddy', periodsPerWeek: 6, isMandatory: true, isActive: true },
  { id: '7', classId: '7', className: 'Class 10', classCode: 'CL10', subjectId: '2', subjectCode: 'MATH', subjectName: 'Mathematics', subjectType: 'Core', assignedTeacher: 'Mr. Anil Gupta', periodsPerWeek: 7, isMandatory: true, isActive: true },
  { id: '8', classId: '7', className: 'Class 10', classCode: 'CL10', subjectId: '3', subjectCode: 'SCI', subjectName: 'Science', subjectType: 'Core', assignedTeacher: 'Dr. Kavita Singh', periodsPerWeek: 7, isMandatory: true, isActive: true },
  { id: '9', classId: '7', className: 'Class 10', classCode: 'CL10', subjectId: '4', subjectCode: 'SST', subjectName: 'Social Studies', subjectType: 'Core', assignedTeacher: 'Mrs. Radha Krishnan', periodsPerWeek: 5, isMandatory: true, isActive: true },
  { id: '10', classId: '7', className: 'Class 10', classCode: 'CL10', subjectId: '7', subjectCode: 'COMP', subjectName: 'Computer Science', subjectType: 'Skill', assignedTeacher: 'Mr. Vikram Sharma', periodsPerWeek: 4, isMandatory: false, isActive: true },
]

function getTypeColor(type: string) {
  switch (type) {
    case 'Core': return 'bg-blue-100 text-blue-700 border-blue-200'
    case 'Elective': return 'bg-purple-100 text-purple-700 border-purple-200'
    case 'Language': return 'bg-green-100 text-green-700 border-green-200'
    case 'Skill': return 'bg-orange-100 text-orange-700 border-orange-200'
    case 'Co-Curricular': return 'bg-pink-100 text-pink-700 border-pink-200'
    default: return 'bg-gray-100 text-gray-700 border-gray-200'
  }
}

export function SubjectMappingPage() {
  const [showAddForm, setShowAddForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterClass, setFilterClass] = useState('all')
  const [showFilters, setShowFilters] = useState(false)
  const [expandedClasses, setExpandedClasses] = useState<Set<string>>(new Set())
  const [formData, setFormData] = useState({
    classId: '',
    subjectId: '',
    assignedTeacher: '',
    periodsPerWeek: '',
    isMandatory: true,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setShowAddForm(false)
    setFormData({ classId: '', subjectId: '', assignedTeacher: '', periodsPerWeek: '', isMandatory: true })
  }

  const toggleClassExpand = (classId: string) => {
    const next = new Set(expandedClasses)
    next.has(classId) ? next.delete(classId) : next.add(classId)
    setExpandedClasses(next)
  }

  const filteredMappings = initialMappings.filter((m) => {
    const q = searchTerm.toLowerCase()
    const matchesSearch = m.subjectName.toLowerCase().includes(q) || m.className.toLowerCase().includes(q) || m.assignedTeacher.toLowerCase().includes(q)
    const matchesClass = filterClass === 'all' || m.classId === filterClass
    return matchesSearch && matchesClass
  })

  const mappingsByClass = filteredMappings.reduce(
    (acc, mapping) => {
      if (!acc[mapping.classId]) {
        acc[mapping.classId] = { classInfo: classes.find((c) => c.id === mapping.classId)!, mappings: [] }
      }
      acc[mapping.classId].mappings.push(mapping)
      return acc
    },
    {} as Record<string, { classInfo: ClassData; mappings: SubjectMapping[] }>,
  )

  const totalMappings = initialMappings.length
  const totalClasses = Object.keys(mappingsByClass).length || 2
  const avgSubjectsPerClass = Math.round(totalMappings / totalClasses)

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
            onClick={() => setShowAddForm(true)}
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
          { label: 'Total Subjects', value: subjects.length, sub: 'Available', icon: Layers, color: 'text-emerald-600', bg: 'bg-emerald-50' },
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
              placeholder="Search by subject, class, or teacher..."
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
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>{cls.name}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Mappings grouped by class */}
      <div className="space-y-4">
        {Object.entries(mappingsByClass).map(([classId, { classInfo, mappings }]) => {
          const isExpanded = expandedClasses.has(classId)
          return (
            <div key={classId} className="bg-white/40 backdrop-blur-xl rounded-2xl border border-white/20 shadow-lg overflow-hidden">
              <button
                onClick={() => toggleClassExpand(classId)}
                className="w-full bg-gradient-to-r from-indigo-50/80 to-purple-50/80 px-6 py-5 flex items-center justify-between hover:from-indigo-100/80 hover:to-purple-100/80 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                    {classInfo.code}
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg font-bold text-gray-800">{classInfo.name}</h3>
                    <p className="text-sm text-gray-500">
                      {mappings.length} subjects mapped &bull; {mappings.reduce((s, m) => s + m.periodsPerWeek, 0)} periods/week
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1.5 bg-white/70 rounded-lg text-sm font-semibold text-gray-700 border border-white/40">
                    {mappings.length} Subjects
                  </span>
                  {isExpanded ? <ChevronUp size={18} className="text-gray-500" /> : <ChevronDown size={18} className="text-gray-500" />}
                </div>
              </button>

              {isExpanded && (
                <div className="p-5 space-y-3 bg-gray-50/40">
                  {mappings.map((mapping) => (
                    <div key={mapping.id} className="bg-white/60 backdrop-blur rounded-xl border border-white/30 p-5 hover:bg-white/80 transition-all">
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
                            <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${getTypeColor(mapping.subjectType)}`}>
                              {mapping.subjectType}
                            </span>
                            {mapping.isMandatory && (
                              <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-red-100 text-red-700 border border-red-200">
                                Mandatory
                              </span>
                            )}
                          </div>
                          <div className="grid grid-cols-2 gap-4 mt-3">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <User size={14} className="text-purple-500 shrink-0" />
                              <div>
                                <p className="text-xs text-gray-400">Assigned Teacher</p>
                                <p className="font-medium text-gray-700">{mapping.assignedTeacher}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Clock size={14} className="text-blue-500 shrink-0" />
                              <div>
                                <p className="text-xs text-gray-400">Periods Per Week</p>
                                <p className="font-medium text-gray-700">{mapping.periodsPerWeek} periods</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-all">
                            <Edit size={15} />
                          </button>
                          <button className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all">
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

      {/* Empty state */}
      {Object.keys(mappingsByClass).length === 0 && (
        <div className="bg-white/40 backdrop-blur-xl rounded-2xl border border-white/20 shadow-lg p-12 text-center">
          <LinkIcon size={56} className="text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">No mappings found</h3>
          <p className="text-gray-500 mb-6">Start by mapping subjects to classes</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-all inline-flex items-center gap-2"
          >
            <Plus size={18} />
            Create First Mapping
          </button>
        </div>
      )}

      {/* Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Map Subject to Class</h2>
                <button onClick={() => setShowAddForm(false)} className="p-2 hover:bg-white/20 rounded-lg transition-all">
                  <X size={20} />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Select Class <span className="text-red-500">*</span></label>
                <select
                  value={formData.classId}
                  onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  required
                >
                  <option value="">Choose a class...</option>
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>{cls.code} - {cls.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Select Subject <span className="text-red-500">*</span></label>
                <select
                  value={formData.subjectId}
                  onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  required
                >
                  <option value="">Choose a subject...</option>
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>{s.code} - {s.name} ({s.type})</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Assigned Teacher</label>
                <input
                  type="text"
                  value={formData.assignedTeacher}
                  onChange={(e) => setFormData({ ...formData, assignedTeacher: e.target.value })}
                  placeholder="e.g., Mrs. Sharma"
                  className="w-full px-4 py-2.5 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
                <p className="text-xs text-gray-400">Optional: Can be assigned later</p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Periods Per Week <span className="text-red-500">*</span></label>
                <input
                  type="number"
                  value={formData.periodsPerWeek}
                  onChange={(e) => setFormData({ ...formData, periodsPerWeek: e.target.value })}
                  placeholder="e.g., 6"
                  min="1"
                  max="10"
                  className="w-full px-4 py-2.5 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  required
                />
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                <input
                  type="checkbox"
                  id="mandatory"
                  checked={formData.isMandatory}
                  onChange={(e) => setFormData({ ...formData, isMandatory: e.target.checked })}
                  className="w-4 h-4 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
                />
                <label htmlFor="mandatory" className="text-sm font-medium text-gray-700 cursor-pointer">
                  This is a mandatory subject for this class
                </label>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle size={16} className="text-blue-500 mt-0.5 shrink-0" />
                <p className="text-sm text-blue-700">You can only map subjects that have been created in the Subject Master page.</p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-medium shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
                >
                  <Save size={16} />
                  Create Mapping
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
