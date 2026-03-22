import  { useState } from 'react';
import { 
  UserPlus, 
  FileText, 
  CheckCircle, 
  Search, 
  Filter, 
  Calendar,
  Phone,
  ArrowRight,
  Clock
} from 'lucide-react';

// Mock Data
const stats = [
  { label: 'Total Inquiries', value: '156', icon: Phone, color: 'bg-blue-100 text-blue-600' },
  { label: 'Applications', value: '89', icon: FileText, color: 'bg-purple-100 text-purple-600' },
  { label: 'Interviews', value: '34', icon: Calendar, color: 'bg-amber-100 text-amber-600' },
  { label: 'Admitted', value: '45', icon: CheckCircle, color: 'bg-emerald-100 text-emerald-600' },
];

const applications = [
  {
    id: 1,
    name: 'Emma Thompson',
    grade: 'Grade 5',
    parent: 'Michael Thompson',
    contact: '+1 555-0123',
    email: 'm.thompson@email.com',
    date: 'Oct 12, 2023',
    status: 'Interview Scheduled',
    statusColor: 'bg-amber-100 text-amber-600'
  },
  {
    id: 2,
    name: 'Liam Wilson',
    grade: 'Grade 3',
    parent: 'Sarah Wilson',
    contact: '+1 555-0456',
    email: 's.wilson@email.com',
    date: 'Oct 10, 2023',
    status: 'New Application',
    statusColor: 'bg-blue-100 text-blue-600'
  },
  {
    id: 3,
    name: 'Sophia Davis',
    grade: 'Grade 8',
    parent: 'James Davis',
    contact: '+1 555-0789',
    email: 'j.davis@email.com',
    date: 'Oct 08, 2023',
    status: 'Admitted',
    statusColor: 'bg-emerald-100 text-emerald-600'
  },
  {
    id: 4,
    name: 'Noah Martinez',
    grade: 'Kindergarten',
    parent: 'Elena Martinez',
    contact: '+1 555-0112',
    email: 'e.martinez@email.com',
    date: 'Oct 05, 2023',
    status: 'Documents Pending',
    statusColor: 'bg-rose-100 text-rose-600'
  },
  {
    id: 5,
    name: 'Olivia Taylor',
    grade: 'Grade 6',
    parent: 'David Taylor',
    contact: '+1 555-0334',
    email: 'd.taylor@email.com',
    date: 'Sep 28, 2023',
    status: 'Waitlisted',
    statusColor: 'bg-gray-100 text-gray-600'
  }
];

export const AdmissionsOverviewPage = () => {
  const [activeTab, setActiveTab] = useState<'applications' | 'inquiries'>('applications');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Admissions</h1>
          <p className="text-sm text-gray-500 mt-2">Manage inquiries, applications, and enrollments</p>
        </div>
        <div className="flex gap-3">
          <button className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2">
            <UserPlus size={18} />
            New Inquiry
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white/40 backdrop-blur-xl p-6 rounded-2xl border border-white/20 shadow-lg flex items-center gap-4 hover:bg-white/50 transition-colors">
            <div className={`p-3 rounded-xl ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="bg-white/40 backdrop-blur-xl rounded-2xl border border-white/20 shadow-lg overflow-hidden animate-in slide-in-from-bottom-4 fade-in duration-500">
        {/* Toolbar */}
        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex bg-white/50 p-1 rounded-xl border border-white/40">
            <button
              onClick={() => setActiveTab('applications')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'applications' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-600 hover:bg-white/50'
              }`}
            >
              Applications
            </button>
            <button
              onClick={() => setActiveTab('inquiries')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'inquiries' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-600 hover:bg-white/50'
              }`}
            >
              Inquiries
            </button>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="text" 
                placeholder="Search applicant..." 
                className="w-full pl-9 pr-4 py-2 bg-white/50 border border-white/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
            <button className="p-2 bg-white/50 border border-white/40 rounded-xl text-gray-600 hover:bg-white transition-colors">
              <Filter size={18} />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-semibold">Applicant Name</th>
                <th className="px-6 py-4 font-semibold">Grade</th>
                <th className="px-6 py-4 font-semibold">Parent Details</th>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {applications.map((app) => (
                <tr key={app.id} className="hover:bg-white/40 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs">
                        {app.name.charAt(0)}
                      </div>
                      <span className="font-medium text-gray-800">{app.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{app.grade}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-gray-800 text-xs font-medium">{app.parent}</span>
                      <span className="text-xs text-gray-500">{app.contact}</span>
                      <span className="text-xs text-gray-400">{app.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600 flex items-center gap-2">
                    <Clock size={14} className="text-gray-400" />
                    {app.date}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${app.statusColor}`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-indigo-600 hover:text-indigo-800 font-medium text-xs flex items-center gap-1 justify-end transition-colors">
                      View Details <ArrowRight size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-gray-100 flex justify-center">
            <button className="text-sm text-gray-500 hover:text-indigo-600 transition-colors font-medium">View All Applications</button>
        </div>
      </div>
    </div>
  );
};
