import {
  Activity,
  ArrowRight,
  BarChart3,
  Calendar,
  CheckCircle,
  Clock,
  Download,
  Edit,
  Eye,
  FileText,
  GraduationCap,
  Phone,
  PieChart,
  Plus,
  TrendingUp,
  UserPlus,
  Users,
} from 'lucide-react'
import { Link } from 'react-router-dom'

interface EnquiryData {
  id: string
  enquiryNumber: string
  studentName: string
  classApplying: string
  parentName: string
  phone: string
  email: string
  source: string
  enquiryDate: string
  status: 'New' | 'Contacted' | 'Follow-up' | 'Converted' | 'Closed'
}

interface RegistrationData {
  id: string
  registrationNumber: string
  studentName: string
  classApplying: string
  dateOfBirth: string
  parentPhone: string
  registrationDate: string
  status: 'Pending' | 'Verified' | 'Approved' | 'Rejected'
}

const recentEnquiries: EnquiryData[] = [
  {
    id: '1',
    enquiryNumber: 'ENQ202603001',
    studentName: 'Aarav Sharma',
    classApplying: 'Class 1',
    parentName: 'Rajesh Sharma',
    phone: '+91 98765 43210',
    email: 'rajesh@example.com',
    source: 'Website',
    enquiryDate: '2026-03-15',
    status: 'New',
  },
  {
    id: '2',
    enquiryNumber: 'ENQ202603002',
    studentName: 'Priya Verma',
    classApplying: 'Nursery',
    parentName: 'Amit Verma',
    phone: '+91 98765 43211',
    email: 'amit@example.com',
    source: 'Referral',
    enquiryDate: '2026-03-14',
    status: 'Contacted',
  },
  {
    id: '3',
    enquiryNumber: 'ENQ202603003',
    studentName: 'Ishaan Patel',
    classApplying: 'Class 5',
    parentName: 'Neha Patel',
    phone: '+91 98765 43212',
    email: 'neha@example.com',
    source: 'Walk-in',
    enquiryDate: '2026-03-13',
    status: 'Follow-up',
  },
]

const recentRegistrations: RegistrationData[] = [
  {
    id: '1',
    registrationNumber: 'REG202603001',
    studentName: 'Kavya Singh',
    classApplying: 'Class 3',
    dateOfBirth: '2018-05-12',
    parentPhone: '+91 98765 43213',
    registrationDate: '2026-03-15',
    status: 'Pending',
  },
  {
    id: '2',
    registrationNumber: 'REG202603002',
    studentName: 'Arjun Reddy',
    classApplying: 'Class 6',
    dateOfBirth: '2015-08-20',
    parentPhone: '+91 98765 43214',
    registrationDate: '2026-03-14',
    status: 'Verified',
  },
  {
    id: '3',
    registrationNumber: 'REG202603003',
    studentName: 'Ananya Gupta',
    classApplying: 'LKG',
    dateOfBirth: '2021-02-15',
    parentPhone: '+91 98765 43215',
    registrationDate: '2026-03-13',
    status: 'Approved',
  },
]

const statusColors: Record<string, string> = {
  New: 'bg-blue-100 text-blue-700 border-blue-200',
  Contacted: 'bg-purple-100 text-purple-700 border-purple-200',
  'Follow-up': 'bg-yellow-100 text-yellow-700 border-yellow-200',
  Converted: 'bg-green-100 text-green-700 border-green-200',
  Closed: 'bg-gray-100 text-gray-700 border-gray-200',
  Pending: 'bg-orange-100 text-orange-700 border-orange-200',
  Verified: 'bg-cyan-100 text-cyan-700 border-cyan-200',
  Approved: 'bg-green-100 text-green-700 border-green-200',
  Rejected: 'bg-red-100 text-red-700 border-red-200',
}

export function AdmissionDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admissions Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage enquiries, registrations, and admissions</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-5 py-2.5 bg-white border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-all flex items-center gap-2 shadow-sm">
              <Download className="w-4 h-4" />
              Export Data
            </button>
            <button className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-sm">
              <Plus className="w-4 h-4" />
              New Enquiry
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Enquiries', value: '248', trend: '+12% this month', trendColor: 'text-green-600', icon: FileText, gradient: 'from-blue-500 to-indigo-600' },
          { label: 'Registrations', value: '156', trend: '+8% this month', trendColor: 'text-green-600', icon: UserPlus, gradient: 'from-purple-500 to-pink-600' },
          { label: 'Admissions', value: '89', trend: '+15% this month', trendColor: 'text-green-600', icon: CheckCircle, gradient: 'from-green-500 to-emerald-600' },
          { label: 'Pending', value: '32', trend: 'Requires attention', trendColor: 'text-orange-600', icon: Clock, gradient: 'from-orange-500 to-amber-600' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/40 shadow-lg p-6 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
                <p className={`text-sm mt-2 flex items-center gap-1 ${stat.trendColor}`}>
                  <TrendingUp className="w-4 h-4" />
                  {stat.trend}
                </p>
              </div>
              <div className={`w-16 h-16 bg-gradient-to-br ${stat.gradient} rounded-2xl flex items-center justify-center shadow-lg`}>
                <stat.icon className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/40 shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { to: '/admissions/enquiry-form', label: 'Enquiry Form', sub: 'New enquiry', icon: FileText, bg: 'from-blue-50 to-indigo-50', border: 'border-blue-200', iconGrad: 'from-blue-500 to-indigo-600', arrow: 'text-blue-600' },
            { to: '/admissions/registration-form', label: 'Registration', sub: 'Basic form', icon: UserPlus, bg: 'from-purple-50 to-pink-50', border: 'border-purple-200', iconGrad: 'from-purple-500 to-pink-600', arrow: 'text-purple-600' },
            { to: '/admissions/comprehensive-registration', label: 'Comprehensive', sub: 'Full details', icon: GraduationCap, bg: 'from-green-50 to-emerald-50', border: 'border-green-200', iconGrad: 'from-green-500 to-emerald-600', arrow: 'text-green-600' },
            { to: '/admissions/flow', label: 'Admission Flow', sub: 'Complete process', icon: Activity, bg: 'from-orange-50 to-amber-50', border: 'border-orange-200', iconGrad: 'from-orange-500 to-amber-600', arrow: 'text-orange-600' },
          ].map((action) => (
            <Link
              key={action.label}
              to={action.to}
              className={`p-6 bg-gradient-to-br ${action.bg} border-2 ${action.border} rounded-xl hover:shadow-lg transition-all group`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${action.iconGrad} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800">{action.label}</h3>
                  <p className="text-xs text-gray-600">{action.sub}</p>
                </div>
                <ArrowRight className={`w-5 h-5 ${action.arrow} group-hover:translate-x-1 transition-transform`} />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Admission Pipeline */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/40 shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Admission Pipeline</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200">
            <div className="text-4xl font-bold text-blue-600 mb-2">248</div>
            <div className="text-sm font-semibold text-gray-700">Enquiries</div>
            <div className="text-xs text-gray-500 mt-1">Initial contact</div>
          </div>
          <div className="flex items-center justify-center">
            <ArrowRight className="w-6 h-6 text-gray-400" />
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200">
            <div className="text-4xl font-bold text-purple-600 mb-2">156</div>
            <div className="text-sm font-semibold text-gray-700">Registrations</div>
            <div className="text-xs text-gray-500 mt-1">Form submitted</div>
          </div>
          <div className="flex items-center justify-center">
            <ArrowRight className="w-6 h-6 text-gray-400" />
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-200">
            <div className="text-4xl font-bold text-green-600 mb-2">89</div>
            <div className="text-sm font-semibold text-gray-700">Admissions</div>
            <div className="text-xs text-gray-500 mt-1">Confirmed</div>
          </div>
        </div>
        <div className="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-sm font-semibold text-gray-700">Overall Conversion Rate</p>
              <p className="text-2xl font-bold text-indigo-600">35.9%</p>
            </div>
            <div className="flex items-center gap-6 text-sm flex-wrap">
              <div>
                <span className="text-gray-600">Enquiry → Registration:</span>
                <span className="font-bold text-purple-600 ml-2">62.9%</span>
              </div>
              <div>
                <span className="text-gray-600">Registration → Admission:</span>
                <span className="font-bold text-green-600 ml-2">57.1%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Enquiries & Registrations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Enquiries */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/40 shadow-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Recent Enquiries</h2>
            <Link to="/admissions/enquiries" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-4">
            {recentEnquiries.map((enquiry) => (
              <div key={enquiry.id} className="p-4 bg-white rounded-xl border-2 border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-gray-800">{enquiry.studentName}</h3>
                    <p className="text-sm text-gray-600">{enquiry.enquiryNumber}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-lg text-xs font-semibold border ${statusColors[enquiry.status]}`}>
                    {enquiry.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                  <div className="flex items-center gap-2 text-gray-600"><GraduationCap className="w-4 h-4" />{enquiry.classApplying}</div>
                  <div className="flex items-center gap-2 text-gray-600"><Calendar className="w-4 h-4" />{new Date(enquiry.enquiryDate).toLocaleDateString()}</div>
                  <div className="flex items-center gap-2 text-gray-600 text-xs"><Phone className="w-4 h-4" />{enquiry.phone}</div>
                  <div className="flex items-center gap-2 text-gray-600 text-xs"><Users className="w-4 h-4" />{enquiry.source}</div>
                </div>
                <div className="flex items-center gap-2 pt-3 border-t border-gray-200">
                  <button className="flex-1 px-3 py-2 bg-indigo-50 text-indigo-600 rounded-lg text-sm font-semibold hover:bg-indigo-100 transition-all flex items-center justify-center gap-1">
                    <Eye className="w-4 h-4" /> View
                  </button>
                  <button className="flex-1 px-3 py-2 bg-green-50 text-green-600 rounded-lg text-sm font-semibold hover:bg-green-100 transition-all flex items-center justify-center gap-1">
                    <Phone className="w-4 h-4" /> Contact
                  </button>
                  <button className="px-3 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-all">
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Registrations */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/40 shadow-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Recent Registrations</h2>
            <Link to="/admissions" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-4">
            {recentRegistrations.map((reg) => (
              <div key={reg.id} className="p-4 bg-white rounded-xl border-2 border-gray-200 hover:border-purple-300 hover:shadow-md transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-gray-800">{reg.studentName}</h3>
                    <p className="text-sm text-gray-600">{reg.registrationNumber}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-lg text-xs font-semibold border ${statusColors[reg.status]}`}>
                    {reg.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                  <div className="flex items-center gap-2 text-gray-600"><GraduationCap className="w-4 h-4" />{reg.classApplying}</div>
                  <div className="flex items-center gap-2 text-gray-600"><Calendar className="w-4 h-4" />{new Date(reg.registrationDate).toLocaleDateString()}</div>
                  <div className="flex items-center gap-2 text-gray-600 text-xs"><Phone className="w-4 h-4" />{reg.parentPhone}</div>
                  <div className="flex items-center gap-2 text-gray-600 text-xs"><Users className="w-4 h-4" />DOB: {new Date(reg.dateOfBirth).toLocaleDateString()}</div>
                </div>
                <div className="flex items-center gap-2 pt-3 border-t border-gray-200">
                  <button className="flex-1 px-3 py-2 bg-purple-50 text-purple-600 rounded-lg text-sm font-semibold hover:bg-purple-100 transition-all flex items-center justify-center gap-1">
                    <Eye className="w-4 h-4" /> View
                  </button>
                  <button className="flex-1 px-3 py-2 bg-green-50 text-green-600 rounded-lg text-sm font-semibold hover:bg-green-100 transition-all flex items-center justify-center gap-1">
                    <CheckCircle className="w-4 h-4" /> Approve
                  </button>
                  <button className="px-3 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-all">
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trend Bar Chart */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/40 shadow-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Monthly Admission Trend</h2>
            <BarChart3 className="w-6 h-6 text-indigo-600" />
          </div>
          <div className="h-64 flex items-end justify-between gap-2">
            {[45, 62, 58, 75, 68, 89, 92, 78, 85, 95, 88, 102].map((value, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full bg-gradient-to-t from-indigo-500 to-purple-500 rounded-t-lg hover:from-indigo-600 hover:to-purple-600 transition-all cursor-pointer"
                  style={{ height: `${(value / 102) * 100}%` }}
                  title={`${value} admissions`}
                />
                <span className="text-xs text-gray-600 font-semibold">
                  {['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][index]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Source Distribution */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/40 shadow-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Enquiry Sources</h2>
            <PieChart className="w-6 h-6 text-purple-600" />
          </div>
          <div className="space-y-4">
            {[
              { name: 'Website', count: 89, color: 'bg-blue-500', percent: 36 },
              { name: 'Walk-in Visit', count: 67, color: 'bg-purple-500', percent: 27 },
              { name: 'Referral', count: 52, color: 'bg-pink-500', percent: 21 },
              { name: 'Phone Call', count: 25, color: 'bg-orange-500', percent: 10 },
              { name: 'Social Media', count: 15, color: 'bg-green-500', percent: 6 },
            ].map((source) => (
              <div key={source.name}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-700">{source.name}</span>
                  <span className="text-sm font-bold text-gray-800">{source.count}</span>
                </div>
                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div className={`h-full ${source.color} rounded-full transition-all`} style={{ width: `${source.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Class-wise Distribution */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/40 shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Class-wise Admission Distribution</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { class: 'Nursery', count: 12, color: 'from-pink-500 to-rose-500' },
            { class: 'LKG', count: 15, color: 'from-purple-500 to-violet-500' },
            { class: 'UKG', count: 18, color: 'from-blue-500 to-cyan-500' },
            { class: 'Class 1-5', count: 28, color: 'from-green-500 to-emerald-500' },
            { class: 'Class 6-8', count: 24, color: 'from-orange-500 to-amber-500' },
            { class: 'Class 9-12', count: 19, color: 'from-red-500 to-pink-500' },
          ].map((item) => (
            <div key={item.class} className="text-center p-6 bg-gradient-to-br from-gray-50 to-white rounded-xl border-2 border-gray-200 hover:shadow-lg transition-all">
              <div className={`text-4xl font-bold bg-gradient-to-r ${item.color} text-transparent bg-clip-text mb-2`}>
                {item.count}
              </div>
              <div className="text-sm font-semibold text-gray-700">{item.class}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
