import {
  Users,
  GraduationCap,
  DollarSign,
  Calendar,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Bell,
  MoreHorizontal,
  Clock,
  UserPlus,
  CalendarPlus,
  FileText,
  MessageSquare,
  Zap,
} from 'lucide-react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import { Link } from 'react-router-dom'

const incomeData = [
  { name: 'Jan', amount: 45000 },
  { name: 'Feb', amount: 52000 },
  { name: 'Mar', amount: 48000 },
  { name: 'Apr', amount: 61000 },
  { name: 'May', amount: 55000 },
  { name: 'Jun', amount: 67000 },
]

const attendanceData = [
  { name: 'Mon', students: 92, staff: 98 },
  { name: 'Tue', students: 88, staff: 96 },
  { name: 'Wed', students: 95, staff: 100 },
  { name: 'Thu', students: 90, staff: 95 },
  { name: 'Fri', students: 85, staff: 92 },
]

const genderData = [
  { name: 'Boys', value: 540, color: '#6366f1' },
  { name: 'Girls', value: 480, color: '#ec4899' },
]

const recentActivities = [
  { id: 1, title: 'New Student Admission', desc: 'Liam Johnson joined Class 10-A', time: '2 hrs ago', icon: Users, color: 'bg-blue-100 text-blue-600' },
  { id: 2, title: 'Fees Received', desc: '$450 collected from Emma Davis', time: '3 hrs ago', icon: DollarSign, color: 'bg-emerald-100 text-emerald-600' },
  { id: 3, title: 'Exam Schedule Published', desc: 'Mid-Term Maths for Class 10', time: '5 hrs ago', icon: Calendar, color: 'bg-purple-100 text-purple-600' },
  { id: 4, title: 'Staff Meeting', desc: 'Weekly sync at 2:00 PM', time: 'Yesterday', icon: Clock, color: 'bg-amber-100 text-amber-600' },
]

type SummaryCardProps = {
  title: string
  value: string
  change: string
  icon: React.ElementType
  color: string
  trend: 'up' | 'down'
}

function SummaryCard({ title, value, change, icon: Icon, color, trend }: SummaryCardProps) {
  return (
    <div className="bg-white/40 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg flex items-center justify-between group hover:bg-white/50 transition-all">
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-gray-800 tracking-tight">{value}</h3>
        <div className={`flex items-center gap-1 mt-2 text-xs font-semibold ${trend === 'up' ? 'text-emerald-600' : 'text-red-600'}`}>
          {trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          <span>{change}</span>
          <span className="text-gray-400 font-normal ml-1">vs last month</span>
        </div>
      </div>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color} bg-opacity-20`}>
        <Icon size={24} className={color.replace('bg-', 'text-').replace('100', '600')} />
      </div>
    </div>
  )
}

// attendanceData imported but kept for future use
void attendanceData

export function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Good Morning, Admin! 👋</h1>
          <p className="text-sm text-gray-500 mt-2">Here's what's happening in your school today.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="px-4 py-2 bg-white/50 rounded-xl border border-white/30 text-sm font-medium text-gray-600">
            Academic Year: <span className="text-indigo-600 font-bold">2023-2024</span>
          </div>
          <button className="w-10 h-10 bg-white/50 hover:bg-white rounded-xl border border-white/30 flex items-center justify-center text-gray-600 shadow-sm relative">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryCard title="Total Students" value="1,248" change="+12%" trend="up" icon={Users} color="bg-indigo-100 text-indigo-600" />
        <SummaryCard title="Total Teachers" value="84" change="+2" trend="up" icon={GraduationCap} color="bg-purple-100 text-purple-600" />
        <SummaryCard title="Revenue (Oct)" value="$67,500" change="+8.4%" trend="up" icon={DollarSign} color="bg-emerald-100 text-emerald-600" />
        <SummaryCard title="Avg Attendance" value="92.6%" change="-1.2%" trend="down" icon={TrendingUp} color="bg-amber-100 text-amber-600" />
      </div>

      {/* Quick Actions Widget */}
      <div className="bg-white/40 backdrop-blur-xl rounded-2xl border border-white/20 shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
            <Zap className="text-indigo-600" size={20} />
          </div>
          <h3 className="text-lg font-bold text-gray-800">Quick Actions</h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { to: '/add-student', icon: UserPlus, label: 'Add Student', bg: 'bg-blue-100', text: 'text-blue-600' },
            { to: '/staff/add', icon: GraduationCap, label: 'Add Teacher', bg: 'bg-purple-100', text: 'text-purple-600' },
            { to: '/attendance/mark', icon: Clock, label: 'Mark Attendance', bg: 'bg-emerald-100', text: 'text-emerald-600' },
            { to: '/events', icon: CalendarPlus, label: 'Add Event', bg: 'bg-orange-100', text: 'text-orange-600' },
            { to: '/exams', icon: FileText, label: 'Create Exam', bg: 'bg-red-100', text: 'text-red-600' },
            { to: '/communication', icon: MessageSquare, label: 'Send Message', bg: 'bg-indigo-100', text: 'text-indigo-600' },
          ].map(({ to, icon: Icon, label, bg, text }) => (
            <Link
              key={to}
              to={to}
              className="flex flex-col items-center gap-3 p-4 bg-white/50 hover:bg-white rounded-xl border border-white/40 transition-all group"
            >
              <div className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <Icon className={text} size={24} />
              </div>
              <span className="text-xs font-medium text-gray-700 text-center">{label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white/40 backdrop-blur-xl rounded-2xl border border-white/20 shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-800">Fee Collection Overview</h3>
            <button className="text-sm text-indigo-600 font-medium hover:underline">View Report</button>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%" minHeight={288}>
              <AreaChart data={incomeData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                />
                <Area type="monotone" dataKey="amount" stroke="#4F46E5" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Student Distribution */}
        <div className="bg-white/40 backdrop-blur-xl rounded-2xl border border-white/20 shadow-lg p-6 flex flex-col">
          <h3 className="text-lg font-bold text-gray-800 mb-2">Student Distribution</h3>
          <div className="flex-1 min-h-[200px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={genderData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {genderData.map((entry, index) => (
                    <Cell key={`gender-cell-${entry.name}-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
              <p className="text-2xl font-bold text-gray-800">1,248</p>
              <p className="text-xs text-gray-500">Total</p>
            </div>
          </div>
          <div className="flex justify-center gap-6 mt-4">
            {genderData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-sm font-medium text-gray-600">{item.name} ({Math.round(item.value / 10.2)}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Activity Feed */}
        <div className="lg:col-span-2 bg-white/40 backdrop-blur-xl rounded-2xl border border-white/20 shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-800">Recent Activity</h3>
            <button className="p-2 hover:bg-white/50 rounded-lg text-gray-500 transition-colors">
              <MoreHorizontal size={20} />
            </button>
          </div>
          <div className="space-y-6">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex gap-4 group">
                <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center ${activity.color}`}>
                  <activity.icon size={18} />
                </div>
                <div className="flex-1 pb-6 border-b border-gray-100/50 group-last:border-none group-last:pb-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-gray-800 text-sm">{activity.title}</h4>
                      <p className="text-xs text-gray-500 mt-1">{activity.desc}</p>
                    </div>
                    <span className="text-xs text-gray-400 font-medium">{activity.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl shadow-xl p-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl -mr-10 -mt-10" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full blur-2xl -ml-10 -mb-10" />

          <h3 className="text-lg font-bold mb-6 relative z-10">Upcoming Events</h3>

          <div className="space-y-4 relative z-10">
            {[
              { day: '25', month: 'October', title: 'Annual Sports Meet', time: '09:00 AM - School Grounds' },
              { day: '30', month: 'October', title: 'Science Exhibition', time: '10:00 AM - Auditorium' },
            ].map((event) => (
              <div key={event.title} className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10 hover:bg-white/20 transition-colors cursor-pointer">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center font-bold text-xs">
                    {event.day}
                  </div>
                  <span className="text-xs font-medium uppercase opacity-80">{event.month}</span>
                </div>
                <h4 className="font-semibold text-sm">{event.title}</h4>
                <p className="text-xs opacity-70 mt-1">{event.time}</p>
              </div>
            ))}
          </div>

          <button className="w-full mt-6 py-2.5 bg-white text-indigo-700 font-bold text-sm rounded-xl shadow-lg hover:bg-indigo-50 transition-colors">
            View Full Calendar
          </button>
        </div>
      </div>
    </div>
  )
}
