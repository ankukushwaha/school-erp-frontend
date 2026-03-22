import  { useState } from 'react';
import {
  UserPlus,
  Search,
  Filter,
  Download,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Edit,
  MessageSquare,
  PhoneCall,
  Send,
  Plus,
  Users,
  TrendingUp,
  BarChart3,
  FileText,
  Star
} from 'lucide-react';

interface Enquiry {
  id: string;
  studentName: string;
  parentName: string;
  email: string;
  phone: string;
  classApplying: string;
  enquiryDate: string;
  followUpDate?: string;
  status: 'new' | 'contacted' | 'follow-up' | 'visit-scheduled' | 'converted' | 'closed';
  priority: 'high' | 'medium' | 'low';
  source: string;
  assignedTo?: string;
  notes?: string;
  address?: string;
  previousSchool?: string;
}

export const EnquiryListPage = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'new' | 'follow-up' | 'converted' | 'closed'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  const enquiries: Enquiry[] = [
    {
      id: 'ENQ001',
      studentName: 'Aarav Sharma',
      parentName: 'Rajesh Sharma',
      email: 'rajesh.sharma@email.com',
      phone: '+91 98765 43210',
      classApplying: 'Class 5',
      enquiryDate: '2026-03-01',
      followUpDate: '2026-03-07',
      status: 'follow-up',
      priority: 'high',
      source: 'Website',
      assignedTo: 'Mrs. Priya Singh',
      address: 'Mumbai, Maharashtra',
      previousSchool: 'ABC Public School',
      notes: 'Parent interested in sports program. Schedule campus visit.'
    },
    {
      id: 'ENQ002',
      studentName: 'Diya Patel',
      parentName: 'Amit Patel',
      email: 'amit.patel@email.com',
      phone: '+91 98765 43211',
      classApplying: 'Nursery',
      enquiryDate: '2026-03-03',
      status: 'new',
      priority: 'medium',
      source: 'Walk-in',
      address: 'Delhi, NCR',
    },
    {
      id: 'ENQ003',
      studentName: 'Arjun Kumar',
      parentName: 'Suresh Kumar',
      email: 'suresh.k@email.com',
      phone: '+91 98765 43212',
      classApplying: 'Class 9',
      enquiryDate: '2026-02-28',
      followUpDate: '2026-03-10',
      status: 'visit-scheduled',
      priority: 'high',
      source: 'Referral',
      assignedTo: 'Mr. Vikram Mehta',
      address: 'Bangalore, Karnataka',
      previousSchool: 'XYZ International School'
    },
    {
      id: 'ENQ004',
      studentName: 'Ananya Singh',
      parentName: 'Deepak Singh',
      email: 'deepak.singh@email.com',
      phone: '+91 98765 43213',
      classApplying: 'Class 1',
      enquiryDate: '2026-03-04',
      status: 'contacted',
      priority: 'medium',
      source: 'Facebook Ad',
      assignedTo: 'Mrs. Priya Singh',
      address: 'Pune, Maharashtra'
    },
    {
      id: 'ENQ005',
      studentName: 'Vihaan Verma',
      parentName: 'Rahul Verma',
      email: 'rahul.verma@email.com',
      phone: '+91 98765 43214',
      classApplying: 'Class 6',
      enquiryDate: '2026-02-25',
      status: 'converted',
      priority: 'high',
      source: 'Google Search',
      assignedTo: 'Mr. Vikram Mehta',
      address: 'Chennai, Tamil Nadu',
      previousSchool: 'DEF School',
      notes: 'Admission completed. Fee paid.'
    },
    {
      id: 'ENQ006',
      studentName: 'Ishita Reddy',
      parentName: 'Sanjay Reddy',
      email: 'sanjay.reddy@email.com',
      phone: '+91 98765 43215',
      classApplying: 'Class 3',
      enquiryDate: '2026-02-20',
      status: 'closed',
      priority: 'low',
      source: 'Walk-in',
      address: 'Hyderabad, Telangana',
      notes: 'Not interested in current fee structure'
    },
  ];

  const stats = {
    total: enquiries.length,
    new: enquiries.filter(e => e.status === 'new').length,
    followUp: enquiries.filter(e => e.status === 'follow-up').length,
    visitScheduled: enquiries.filter(e => e.status === 'visit-scheduled').length,
    converted: enquiries.filter(e => e.status === 'converted').length,
    closed: enquiries.filter(e => e.status === 'closed').length,
    conversionRate: ((enquiries.filter(e => e.status === 'converted').length / enquiries.length) * 100).toFixed(1)
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-700';
      case 'contacted': return 'bg-purple-100 text-purple-700';
      case 'follow-up': return 'bg-yellow-100 text-yellow-700';
      case 'visit-scheduled': return 'bg-indigo-100 text-indigo-700';
      case 'converted': return 'bg-green-100 text-green-700';
      case 'closed': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new': return <Star className="w-4 h-4" />;
      case 'contacted': return <PhoneCall className="w-4 h-4" />;
      case 'follow-up': return <Clock className="w-4 h-4" />;
      case 'visit-scheduled': return <Calendar className="w-4 h-4" />;
      case 'converted': return <CheckCircle className="w-4 h-4" />;
      case 'closed': return <XCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-orange-100 text-orange-700';
      case 'low': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const filteredEnquiries = enquiries.filter(enquiry => {
    const matchesTab = activeTab === 'all' || 
      (activeTab === 'new' && enquiry.status === 'new') ||
      (activeTab === 'follow-up' && (enquiry.status === 'follow-up' || enquiry.status === 'contacted')) ||
      (activeTab === 'converted' && enquiry.status === 'converted') ||
      (activeTab === 'closed' && enquiry.status === 'closed');
    
    const matchesSearch = enquiry.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enquiry.parentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enquiry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enquiry.phone.includes(searchTerm) ||
      enquiry.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesClass = !selectedClass || enquiry.classApplying === selectedClass;
    const matchesStatus = !selectedStatus || enquiry.status === selectedStatus;

    return matchesTab && matchesSearch && matchesClass && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Enquiry Management</h1>
          <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
            <span>Dashboard</span>
            <span>/</span>
            <span>Admissions</span>
            <span>/</span>
            <span className="text-indigo-600 font-medium">Enquiries</span>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white/70 backdrop-blur-sm hover:bg-white border border-white/40 rounded-xl text-sm font-medium text-gray-700 shadow-sm transition-all flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </button>
          <button 
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl text-sm font-medium shadow-lg shadow-indigo-500/30 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Enquiry
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl border border-white/40 shadow-lg hover:shadow-xl transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium mb-1">Total Enquiries</p>
              <h3 className="text-3xl font-bold text-gray-800">{stats.total}</h3>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm text-indigo-600 font-medium">
            <TrendingUp className="w-4 h-4" />
            <span>This month</span>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl border border-white/40 shadow-lg hover:shadow-xl transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium mb-1">New Enquiries</p>
              <h3 className="text-3xl font-bold text-gray-800">{stats.new}</h3>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
              <Star className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="mt-4 text-sm text-blue-600 font-medium">
            Requires immediate attention
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl border border-white/40 shadow-lg hover:shadow-xl transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium mb-1">Follow-ups Pending</p>
              <h3 className="text-3xl font-bold text-gray-800">{stats.followUp}</h3>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="mt-4 text-sm text-yellow-600 font-medium">
            Action required
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl border border-white/40 shadow-lg hover:shadow-xl transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium mb-1">Conversion Rate</p>
              <h3 className="text-3xl font-bold text-gray-800">{stats.conversionRate}%</h3>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="mt-4 text-sm text-green-600 font-medium">
            {stats.converted} converted
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/40 shadow-lg">
        {/* Tabs */}
        <div className="border-b border-gray-200 px-6">
          <div className="flex gap-6 overflow-x-auto">
            {[
              { id: 'all', label: 'All Enquiries', count: stats.total },
              { id: 'new', label: 'New', count: stats.new },
              { id: 'follow-up', label: 'Follow-up', count: stats.followUp },
              { id: 'converted', label: 'Converted', count: stats.converted },
              { id: 'closed', label: 'Closed', count: stats.closed },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-all ${
                  activeTab === tab.id
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, phone, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            >
              <option value="">All Classes</option>
              <option value="Nursery">Nursery</option>
              <option value="Class 1">Class 1</option>
              <option value="Class 5">Class 5</option>
              <option value="Class 6">Class 6</option>
              <option value="Class 9">Class 9</option>
            </select>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            >
              <option value="">All Status</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="follow-up">Follow-up</option>
              <option value="visit-scheduled">Visit Scheduled</option>
              <option value="converted">Converted</option>
              <option value="closed">Closed</option>
            </select>
            <button className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all flex items-center gap-2">
              <Filter className="w-4 h-4" />
              More Filters
            </button>
          </div>

          {/* Enquiries List */}
          <div className="space-y-4">
            {filteredEnquiries.map((enquiry) => (
              <div key={enquiry.id} className="bg-gradient-to-br from-white to-gray-50 p-5 rounded-xl border border-gray-200 hover:shadow-md transition-all">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  {/* Main Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-gray-900">{enquiry.studentName}</h3>
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(enquiry.status)}`}>
                            {getStatusIcon(enquiry.status)}
                            {enquiry.status.charAt(0).toUpperCase() + enquiry.status.slice(1).replace('-', ' ')}
                          </span>
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getPriorityColor(enquiry.priority)}`}>
                            {enquiry.priority.toUpperCase()}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {enquiry.parentName}
                          </span>
                          <span className="flex items-center gap-1">
                            <Mail className="w-4 h-4" />
                            {enquiry.email}
                          </span>
                          <span className="flex items-center gap-1">
                            <Phone className="w-4 h-4" />
                            {enquiry.phone}
                          </span>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium whitespace-nowrap">
                        {enquiry.id}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      <div className="flex items-center gap-1 text-gray-700">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="font-medium">Class:</span>
                        <span>{enquiry.classApplying}</span>
                      </div>
                      {enquiry.address && (
                        <div className="flex items-center gap-1 text-gray-700">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span>{enquiry.address}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1 text-gray-700">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span>Enquiry: {new Date(enquiry.enquiryDate).toLocaleDateString()}</span>
                      </div>
                      {enquiry.followUpDate && (
                        <div className="flex items-center gap-1 text-yellow-600 font-medium">
                          <AlertCircle className="w-4 h-4" />
                          <span>Follow-up: {new Date(enquiry.followUpDate).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>

                    {enquiry.assignedTo && (
                      <div className="mt-2 flex items-center gap-1 text-sm text-purple-700">
                        <UserPlus className="w-4 h-4" />
                        <span>Assigned to: {enquiry.assignedTo}</span>
                      </div>
                    )}

                    {enquiry.notes && (
                      <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
                        <MessageSquare className="w-4 h-4 inline mr-2" />
                        {enquiry.notes}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex lg:flex-col gap-2">
                    <button 
                      onClick={() => {
                        setSelectedEnquiry(enquiry);
                        setShowDetailsModal(true);
                      }}
                      className="flex-1 lg:flex-none px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                    <button className="flex-1 lg:flex-none px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
                      <PhoneCall className="w-4 h-4" />
                      Call
                    </button>
                    <button className="flex-1 lg:flex-none px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email
                    </button>
                    <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {filteredEnquiries.length === 0 && (
              <div className="text-center py-12">
                <UserPlus className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No enquiries found</h3>
                <p className="text-gray-600 mb-6">Try adjusting your filters or search term</p>
                <button 
                  onClick={() => setShowAddModal(true)}
                  className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 transition-all inline-flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add New Enquiry
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Enquiry Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">New Enquiry</h3>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <XCircle className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Student Information */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Student Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Student Name *</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Enter student name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Class Applying For *</label>
                    <select className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                      <option>Select class</option>
                      <option>Nursery</option>
                      <option>LKG</option>
                      <option>UKG</option>
                      <option>Class 1</option>
                      <option>Class 2</option>
                      <option>Class 3</option>
                      <option>Class 4</option>
                      <option>Class 5</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                    <input
                      type="date"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Previous School</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Enter previous school"
                    />
                  </div>
                </div>
              </div>

              {/* Parent Information */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Parent/Guardian Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Parent Name *</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Enter parent name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                    <input
                      type="tel"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="+91 XXXXX XXXXX"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                    <input
                      type="email"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="parent@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Occupation</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Enter occupation"
                    />
                  </div>
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <textarea
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  rows={3}
                  placeholder="Enter complete address"
                />
              </div>

              {/* Enquiry Details */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Enquiry Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Source *</label>
                    <select className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                      <option>Select source</option>
                      <option>Website</option>
                      <option>Walk-in</option>
                      <option>Phone Call</option>
                      <option>Referral</option>
                      <option>Facebook Ad</option>
                      <option>Google Search</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                    <select className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                      <option>Medium</option>
                      <option>High</option>
                      <option>Low</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Assign To</label>
                    <select className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                      <option>Select staff member</option>
                      <option>Mrs. Priya Singh</option>
                      <option>Mr. Vikram Mehta</option>
                      <option>Mrs. Anjali Kapoor</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Follow-up Date</label>
                    <input
                      type="date"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                <textarea
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  rows={4}
                  placeholder="Add any additional notes or requirements..."
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button className="flex-1 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 transition-all flex items-center justify-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add Enquiry
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {showDetailsModal && selectedEnquiry && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold">Enquiry Details</h3>
                <p className="text-indigo-100 text-sm">{selectedEnquiry.id}</p>
              </div>
              <button onClick={() => setShowDetailsModal(false)} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Status & Priority */}
              <div className="flex items-center gap-3">
                <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium ${getStatusColor(selectedEnquiry.status)}`}>
                  {getStatusIcon(selectedEnquiry.status)}
                  {selectedEnquiry.status.charAt(0).toUpperCase() + selectedEnquiry.status.slice(1).replace('-', ' ')}
                </span>
                <span className={`px-4 py-2 rounded-xl text-sm font-medium ${getPriorityColor(selectedEnquiry.priority)}`}>
                  {selectedEnquiry.priority.toUpperCase()} Priority
                </span>
              </div>

              {/* Student Info */}
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-xl">
                <h4 className="font-semibold text-gray-900 mb-4">Student Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Student Name</p>
                    <p className="font-semibold text-gray-900">{selectedEnquiry.studentName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Class Applying</p>
                    <p className="font-semibold text-gray-900">{selectedEnquiry.classApplying}</p>
                  </div>
                  {selectedEnquiry.previousSchool && (
                    <div className="col-span-2">
                      <p className="text-sm text-gray-600">Previous School</p>
                      <p className="font-semibold text-gray-900">{selectedEnquiry.previousSchool}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Parent Contact */}
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-xl">
                <h4 className="font-semibold text-gray-900 mb-4">Parent/Guardian Contact</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600">Name</p>
                      <p className="font-semibold text-gray-900">{selectedEnquiry.parentName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="font-semibold text-gray-900">{selectedEnquiry.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-semibold text-gray-900">{selectedEnquiry.email}</p>
                    </div>
                  </div>
                  {selectedEnquiry.address && (
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-red-600" />
                      <div>
                        <p className="text-sm text-gray-600">Address</p>
                        <p className="font-semibold text-gray-900">{selectedEnquiry.address}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Enquiry Timeline */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Enquiry Timeline</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-600">Enquiry Date:</span>
                    <span className="font-medium text-gray-900">{new Date(selectedEnquiry.enquiryDate).toLocaleDateString()}</span>
                  </div>
                  {selectedEnquiry.followUpDate && (
                    <div className="flex items-center gap-3 text-sm">
                      <Clock className="w-5 h-5 text-yellow-500" />
                      <span className="text-gray-600">Follow-up Date:</span>
                      <span className="font-medium text-yellow-700">{new Date(selectedEnquiry.followUpDate).toLocaleDateString()}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-3 text-sm">
                    <FileText className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-600">Source:</span>
                    <span className="font-medium text-gray-900">{selectedEnquiry.source}</span>
                  </div>
                  {selectedEnquiry.assignedTo && (
                    <div className="flex items-center gap-3 text-sm">
                      <UserPlus className="w-5 h-5 text-purple-500" />
                      <span className="text-gray-600">Assigned To:</span>
                      <span className="font-medium text-gray-900">{selectedEnquiry.assignedTo}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Notes */}
              {selectedEnquiry.notes && (
                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl">
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-yellow-600" />
                    Notes
                  </h4>
                  <p className="text-gray-700">{selectedEnquiry.notes}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-200">
                <button className="px-4 py-2.5 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
                  <PhoneCall className="w-4 h-4" />
                  Make Call
                </button>
                <button className="px-4 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                  <Send className="w-4 h-4" />
                  Send Email
                </button>
                <button className="px-4 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2">
                  <Edit className="w-4 h-4" />
                  Edit Details
                </button>
                <button className="px-4 py-2.5 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition-colors flex items-center justify-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Convert to Admission
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
