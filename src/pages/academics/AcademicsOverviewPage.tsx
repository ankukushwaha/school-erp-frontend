import {
  BookOpen,
  Calendar,
  Clock,
  FileText,
  GraduationCap,
  Layers,
  Users,
  TrendingUp,
  Award,
  BookMarked,
  Clipboard,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/app/constants/routes'

const quickAccessCards = [
  {
    to: '/academics/academic-year',
    gradient: 'from-indigo-500 to-purple-600',
    icon: Calendar,
    stat: '2024-25',
    statLabel: 'Active Year',
    title: 'Academic Year Setup',
    description: 'Define academic years, terms, and schedules',
  },
  {
    to: '/academics/classManagement',
    gradient: 'from-emerald-500 to-teal-600',
    icon: BookOpen,
    stat: '12',
    statLabel: 'Classes',
    title: 'Class Management',
    description: 'Manage classes from Nursery to Grade 12',
  },
  {
    to: '/academics/sectionManagement',
    gradient: 'from-amber-500 to-orange-600',
    icon: Layers,
    stat: '36',
    statLabel: 'Sections',
    title: 'Section Management',
    description: 'Manage sections, rooms, and capacity',
  },
  {
    to: '/academics/subjectEntry',
    gradient: 'from-rose-500 to-pink-600',
    icon: FileText,
    stat: '42',
    statLabel: 'Subjects',
    title: 'Subject Management',
    description: 'Manage subjects and teacher assignments',
  },
  {
    to: '/academics/calendar',
    gradient: 'from-sky-500 to-blue-600',
    icon: BookMarked,
    stat: '8',
    statLabel: 'Events',
    title: 'Academic Calendar',
    description: 'View and manage academic events',
  },
  {
    to: ROUTES.timetableManagement,
    gradient: 'from-pink-500 to-rose-600',
    icon: Clock,
    stat: '15',
    statLabel: 'Schedules',
    title: 'Timetable Management',
    description: 'Create and manage class schedules',
  },
  {
    to: '/academics/teacher-allocation',
    gradient: 'from-violet-500 to-indigo-600',
    icon: GraduationCap,
    stat: '15',
    statLabel: 'Teachers',
    title: 'Teacher Allocation',
    description: 'Assign class teachers to sections',
  },
  {
    to: '/academics/syllabus-management',
    gradient: 'from-blue-500 to-indigo-600',
    icon: BookMarked,
    stat: '42',
    statLabel: 'Subjects',
    title: 'Syllabus Management',
    description: 'Track curriculum progress and topics',
  },
  {
    to: '/academics/lesson-plan',
    gradient: 'from-amber-500 to-orange-600',
    icon: Clipboard,
    stat: '12',
    statLabel: 'Active',
    title: 'Lesson Plans',
    description: 'Create and track daily teaching strategies',
  },
]

const summaryStats = [
  { label: 'Total Classes', value: '12', icon: BookOpen, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  { label: 'Total Sections', value: '36', icon: Layers, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { label: 'Total Subjects', value: '42', icon: FileText, color: 'text-rose-600', bg: 'bg-rose-50' },
  { label: 'Total Students', value: '1,240', icon: Users, color: 'text-amber-600', bg: 'bg-amber-50' },
  { label: 'Teachers', value: '68', icon: GraduationCap, color: 'text-purple-600', bg: 'bg-purple-50' },
  { label: 'Pass Rate', value: '94%', icon: TrendingUp, color: 'text-teal-600', bg: 'bg-teal-50' },
]

const recentActivities = [
  { icon: BookOpen, color: 'bg-indigo-100 text-indigo-600', text: 'New class "Grade 12 Science" was added', time: '2 hours ago' },
  { icon: Users, color: 'bg-emerald-100 text-emerald-600', text: '15 students enrolled in Class 5-A', time: '5 hours ago' },
  { icon: Calendar, color: 'bg-amber-100 text-amber-600', text: 'Academic year 2024-25 term 2 started', time: '1 day ago' },
  { icon: FileText, color: 'bg-rose-100 text-rose-600', text: 'Mathematics subject updated for Grade 10', time: '2 days ago' },
  { icon: Award, color: 'bg-purple-100 text-purple-600', text: 'Annual exam schedule published', time: '3 days ago' },
]

export function AcademicsOverviewPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Academics Overview</h1>
          <p className="text-sm text-gray-500 mt-2">Complete overview of the academic structure and curriculum</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-xl border border-indigo-100">
          <Calendar size={16} className="text-indigo-600" />
          <span className="text-sm font-semibold text-indigo-700">Academic Year: 2024–25</span>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {summaryStats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white/40 backdrop-blur-xl rounded-2xl border border-white/20 shadow-lg p-4 flex flex-col items-center text-center gap-2 hover:bg-white/60 transition-all"
          >
            <div className={`w-10 h-10 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
              <stat.icon size={20} />
            </div>
            <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
            <p className="text-xs text-gray-500 font-medium">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Access Cards */}
      <div>
        <h2 className="text-lg font-bold text-gray-700 mb-4">Quick Access</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickAccessCards.map((card) => (
            <Link
              key={card.to}
              to={card.to}
              className={`bg-gradient-to-br ${card.gradient} rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all group`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <card.icon size={28} />
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">{card.stat}</p>
                  <p className="text-sm text-white/80">{card.statLabel}</p>
                </div>
              </div>
              <h3 className="text-xl font-bold mb-1">{card.title}</h3>
              <p className="text-sm text-white/80">{card.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-lg font-bold text-gray-700 mb-4">Recent Activity</h2>
        <div className="bg-white/40 backdrop-blur-xl rounded-2xl border border-white/20 shadow-lg divide-y divide-white/30">
          {recentActivities.map((activity, idx) => (
            <div key={idx} className="flex items-center gap-4 px-6 py-4 hover:bg-white/30 transition-colors">
              <div className={`w-9 h-9 rounded-xl ${activity.color} flex items-center justify-center shrink-0`}>
                <activity.icon size={16} />
              </div>
              <p className="flex-1 text-sm text-gray-700">{activity.text}</p>
              <span className="text-xs text-gray-400 whitespace-nowrap">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Class & Section Summary Table */}
      <div>
        <h2 className="text-lg font-bold text-gray-700 mb-4">Class & Section Summary</h2>
        <div className="bg-white/40 backdrop-blur-xl rounded-2xl border border-white/20 shadow-lg overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-semibold">Class</th>
                <th className="px-6 py-4 font-semibold">Sections</th>
                <th className="px-6 py-4 font-semibold">Students</th>
                <th className="px-6 py-4 font-semibold">Subjects</th>
                <th className="px-6 py-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[
                { name: 'Class 1', code: '1', sections: 2, students: 45, subjects: 6 },
                { name: 'Class 2', code: '2', sections: 2, students: 48, subjects: 7 },
                { name: 'Class 3', code: '3', sections: 3, students: 72, subjects: 7 },
                { name: 'Class 4', code: '4', sections: 2, students: 50, subjects: 8 },
                { name: 'Class 5', code: '5', sections: 3, students: 75, subjects: 8 },
              ].map((cls) => (
                <tr key={cls.code} className="hover:bg-white/40 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm">
                        {cls.code}
                      </div>
                      <span className="font-semibold text-gray-800">{cls.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    <span className="flex items-center gap-1">
                      <Layers size={14} className="text-emerald-500" />
                      {cls.sections}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    <span className="flex items-center gap-1">
                      <Users size={14} className="text-amber-500" />
                      {cls.students}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    <span className="flex items-center gap-1">
                      <FileText size={14} className="text-rose-500" />
                      {cls.subjects}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold">
                      Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
