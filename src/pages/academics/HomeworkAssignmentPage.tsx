import { useState } from 'react';
import {
  BookOpen,
  Plus,
  Upload,
  Eye,
  Edit,
  Trash2,
  Clock,
  CheckCircle,
  AlertCircle,
  Calendar,
  Users,
  FileText,
  Award,
  Video,
  Image,
  Link as LinkIcon,
  File,
  Search,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AssignmentModal, type Assignment, type AssignmentStatus } from '@/components/modal/academics/AssignmentSystemModal';

type ViewMode = 'teacher' | 'student' | 'parent';

export const HomeworkAssignmentSystemPage = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('teacher');
  const [selectedTab, setSelectedTab] = useState<'all' | 'active' | 'completed' | 'grading'>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSubject, setFilterSubject] = useState('all');
  const [expandedAssignment, setExpandedAssignment] = useState<string | null>(null);

  // Mock data
  const [assignments, setAssignments] = useState<Assignment[]>([
    {
      id: '1',
      title: 'Quadratic Equations - Problem Set',
      subject: 'Mathematics',
      class: '10',
      section: 'A',
      description: 'Complete all problems from Chapter 4. Show your work and explain your reasoning for each solution.',
      dueDate: '2026-03-10',
      dueTime: '11:59 PM',
      assignedDate: '2026-03-05',
      totalMarks: 50,
      attachments: [
        { id: '1', name: 'Problem_Set.pdf', type: 'pdf', size: '2.5 MB', url: '#' },
        { id: '2', name: 'Reference_Material.pdf', type: 'pdf', size: '1.8 MB', url: '#' },
      ],
      status: 'active',
      submissionCount: 38,
      totalStudents: 45,
      submissionRate: 84.4,
      avgGrade: 0,
      teacher: 'Ms. Sarah Johnson',
      priority: 'high',
      allowLateSubmission: true,
      rubric: {
        criteria: [
          { name: 'Accuracy', maxPoints: 30, description: 'Correct solutions with proper steps' },
          { name: 'Work Shown', maxPoints: 10, description: 'Clear mathematical reasoning' },
          { name: 'Presentation', maxPoints: 10, description: 'Neat and organized work' },
        ],
      },
    },
    {
      id: '2',
      title: 'Chemical Reactions Lab Report',
      subject: 'Chemistry',
      class: '10',
      section: 'A',
      description: 'Write a detailed lab report on the chemical reactions experiment conducted in class. Include observations, results, and conclusions.',
      dueDate: '2026-03-12',
      dueTime: '11:59 PM',
      assignedDate: '2026-03-06',
      totalMarks: 40,
      attachments: [
        { id: '3', name: 'Lab_Guidelines.pdf', type: 'pdf', size: '1.2 MB', url: '#' },
        { id: '4', name: 'Sample_Report.doc', type: 'doc', size: '856 KB', url: '#' },
      ],
      status: 'active',
      submissionCount: 25,
      totalStudents: 45,
      submissionRate: 55.6,
      avgGrade: 0,
      teacher: 'Dr. Michael Chen',
      priority: 'medium',
      allowLateSubmission: false,
    },
    {
      id: '3',
      title: 'Essay: Climate Change Impact',
      subject: 'English',
      class: '10',
      section: 'A',
      description: 'Write a 1000-word essay discussing the impact of climate change on our planet. Use at least 3 credible sources.',
      dueDate: '2026-03-08',
      dueTime: '11:59 PM',
      assignedDate: '2026-03-01',
      totalMarks: 100,
      attachments: [
        { id: '5', name: 'Essay_Rubric.pdf', type: 'pdf', size: '650 KB', url: '#' },
      ],
      status: 'overdue',
      submissionCount: 42,
      totalStudents: 45,
      submissionRate: 93.3,
      avgGrade: 78.5,
      teacher: 'Ms. Emma Williams',
      priority: 'high',
      allowLateSubmission: true,
    },
    {
      id: '4',
      title: 'World War II Timeline Project',
      subject: 'History',
      class: '10',
      section: 'A',
      description: 'Create a detailed timeline of major events during World War II. Include dates, locations, and significance of each event.',
      dueDate: '2026-03-15',
      dueTime: '11:59 PM',
      assignedDate: '2026-03-07',
      totalMarks: 75,
      attachments: [],
      status: 'active',
      submissionCount: 15,
      totalStudents: 45,
      submissionRate: 33.3,
      avgGrade: 0,
      teacher: 'Mr. David Brown',
      priority: 'medium',
      allowLateSubmission: true,
    },
  ]);

  const subjects = ['All Subjects', 'Mathematics', 'Science', 'English', 'History', 'Chemistry'];

  const filteredAssignments = assignments.filter((assignment) => {
    const matchesSearch = assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assignment.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = filterSubject === 'all' || assignment.subject === filterSubject;
    const matchesTab =
      selectedTab === 'all' ||
      (selectedTab === 'active' && assignment.status === 'active') ||
      (selectedTab === 'completed' && assignment.status === 'completed') ||
      (selectedTab === 'grading' && assignment.submissionCount > 0 && assignment.avgGrade === 0);
    return matchesSearch && matchesSubject && matchesTab;
  });

  const getStatusColor = (status: AssignmentStatus) => {
    switch (status) {
      case 'active':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'overdue':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'draft':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getPriorityColor = (priority: 'low' | 'medium' | 'high') => {
    switch (priority) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-orange-600';
      case 'low':
        return 'text-green-600';
    }
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
      case 'doc':
        return <FileText className="w-4 h-4" />;
      case 'image':
        return <Image className="w-4 h-4" />;
      case 'video':
        return <Video className="w-4 h-4" />;
      case 'link':
        return <LinkIcon className="w-4 h-4" />;
      default:
        return <File className="w-4 h-4" />;
    }
  };

  const handleCreateAssignment = () => {
    setSelectedAssignment(null);
    setShowCreateModal(true);
  };

  const handleEditAssignment = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setShowCreateModal(true);
  };

  const handleSaveAssignment = (data: Partial<Assignment>) => {
    if (selectedAssignment) {
      setAssignments(assignments.map(a => a.id === selectedAssignment.id ? { ...a, ...data } as Assignment : a));
    } else {
      const newAssignment: Assignment = {
        ...data,
        id: (assignments.length + 1).toString(),
        assignedDate: new Date().toISOString().split('T')[0],
        status: 'active',
        submissionCount: 0,
        totalStudents: 45,
        submissionRate: 0,
        avgGrade: 0,
        teacher: 'Ms. Sarah Johnson',
        attachments: [],
      } as Assignment;
      setAssignments([...assignments, newAssignment]);
    }
    setShowCreateModal(false);
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-2xl p-6 border border-white/20 shadow-xl bg-white/40 backdrop-blur-md"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-400 to-purple-600 flex items-center justify-center shadow-lg text-white">
              <BookOpen className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Assignments Systems
              </h1>
              <p className="text-gray-600 mt-1">
                Create, manage, and grade student assignments
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 p-1 bg-white rounded-xl border border-gray-200 shadow-sm">
              {(['teacher', 'student', 'parent'] as ViewMode[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    viewMode === mode
                      ? 'bg-violet-600 text-white shadow-sm'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </button>
              ))}
            </div>
            {viewMode === 'teacher' && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCreateAssignment}
                className="px-6 py-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl font-semibold hover:from-violet-700 hover:to-purple-700 transition-all shadow-md flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Create Assignment
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Assignments', value: assignments.filter(a => a.status === 'active').length, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50', badge: 'Active' },
          { label: 'Submissions Received', value: assignments.reduce((acc, a) => acc + a.submissionCount, 0), icon: Users, color: 'text-purple-600', bg: 'bg-purple-50', badge: 'Total' },
          { label: 'Pending Submissions', value: assignments.filter(a => a.status === 'active').reduce((acc, a) => acc + (a.totalStudents - a.submissionCount), 0), icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50', badge: 'Pending' },
          { label: 'Average Grade', value: (assignments.filter(a => a.avgGrade > 0).reduce((acc, a) => acc + a.avgGrade, 0) / (assignments.filter(a => a.avgGrade > 0).length || 1)).toFixed(1) + '%', icon: Award, color: 'text-green-600', bg: 'bg-green-50', badge: 'Avg' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all bg-white/40 backdrop-blur-md"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <span className={`text-xs font-semibold ${stat.color} ${stat.bg} px-2 py-1 rounded-full`}>
                {stat.badge}
              </span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</h3>
            <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-2xl p-6 border border-white/20 shadow-lg bg-white/40 backdrop-blur-md"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="flex items-center gap-2 p-1 bg-white rounded-xl border border-gray-200 shadow-sm">
            {(['all', 'active', 'completed', 'grading'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  selectedTab === tab
                    ? 'bg-violet-600 text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1).replace('grading', 'Needs Grading')}
              </button>
            ))}
          </div>

          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search assignments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-xl focus:border-violet-500 focus:outline-none transition-colors"
            />
          </div>

          <select
            value={filterSubject}
            onChange={(e) => setFilterSubject(e.target.value)}
            className="px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-violet-500 focus:outline-none transition-colors"
          >
            {subjects.map((subject) => (
              <option key={subject} value={subject === 'All Subjects' ? 'all' : subject}>
                {subject}
              </option>
            ))}
          </select>
        </div>
      </motion.div>

      {/* Assignments List */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredAssignments.map((assignment, index) => (
            <motion.div
              key={assignment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.05 }}
              className="glass-card rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all bg-white/40 backdrop-blur-md"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{assignment.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border-2 ${getStatusColor(assignment.status)}`}>
                      {assignment.status.toUpperCase()}
                    </span>
                    {assignment.priority === 'high' && (
                      <AlertCircle className={`w-5 h-5 ${getPriorityColor(assignment.priority)}`} />
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      {assignment.subject}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      Class {assignment.class}-{assignment.section}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Due: {assignment.dueDate} at {assignment.dueTime}
                    </div>
                    <div className="flex items-center gap-1">
                      <Award className="w-4 h-4" />
                      {assignment.totalMarks} marks
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setExpandedAssignment(expandedAssignment === assignment.id ? null : assignment.id)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  {expandedAssignment === assignment.id ? (
                    <ChevronDown className="w-5 h-5 text-gray-600" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-600" />
                  )}
                </button>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-700">
                    Submission Progress
                  </span>
                  <span className="text-sm font-bold text-violet-600">
                    {assignment.submissionCount}/{assignment.totalStudents} ({assignment.submissionRate.toFixed(1)}%)
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-violet-500 to-purple-600 rounded-full transition-all"
                    style={{ width: `${assignment.submissionRate}%` }}
                  />
                </div>
              </div>

              {assignment.attachments.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {assignment.attachments.map((attachment) => (
                    <div
                      key={attachment.id}
                      className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg hover:border-violet-300 transition-all cursor-pointer"
                    >
                      {getFileIcon(attachment.type)}
                      <span className="text-sm font-medium text-gray-700">{attachment.name}</span>
                      <span className="text-xs text-gray-500">{attachment.size}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 px-4 py-2 bg-white border-2 border-gray-200 rounded-xl hover:border-violet-300 transition-all text-sm font-semibold flex items-center justify-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  View Details
                </motion.button>
                {viewMode === 'teacher' && (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl hover:from-violet-700 hover:to-purple-700 transition-all text-sm font-semibold flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      View Submissions ({assignment.submissionCount})
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleEditAssignment(assignment)}
                      className="px-4 py-2 bg-white border-2 border-gray-200 rounded-xl hover:border-violet-300 transition-all text-sm font-semibold"
                    >
                      <Edit className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 bg-white border-2 border-red-200 text-red-600 rounded-xl hover:bg-red-50 transition-all text-sm font-semibold"
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </>
                )}
                {viewMode === 'student' && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl hover:from-violet-700 hover:to-purple-700 transition-all text-sm font-semibold flex items-center justify-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    Submit Assignment
                  </motion.button>
                )}
              </div>

              <AnimatePresence>
                {expandedAssignment === assignment.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 pt-4 border-t-2 border-gray-200 overflow-hidden"
                  >
                    <h4 className="font-semibold text-gray-900 mb-2">Description:</h4>
                    <p className="text-gray-700 mb-4">{assignment.description}</p>

                    {assignment.rubric && (
                      <div className="mb-4">
                        <h4 className="font-semibold text-gray-900 mb-3">Grading Rubric:</h4>
                        <div className="space-y-2">
                          {assignment.rubric.criteria.map((criterion, idx) => (
                            <div key={idx} className="p-3 bg-violet-50 border border-violet-200 rounded-lg">
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-semibold text-gray-900">{criterion.name}</span>
                                <span className="text-sm font-bold text-violet-600">
                                  {criterion.maxPoints} points
                                </span>
                              </div>
                              <p className="text-sm text-gray-600">{criterion.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="text-xs text-gray-600 mb-1">Assigned By</div>
                        <div className="text-sm font-semibold text-gray-900">{assignment.teacher}</div>
                      </div>
                      <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                        <div className="text-xs text-gray-600 mb-1">Assigned Date</div>
                        <div className="text-sm font-semibold text-gray-900">{assignment.assignedDate}</div>
                      </div>
                      <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                        <div className="text-xs text-gray-600 mb-1">Late Submission</div>
                        <div className="text-sm font-semibold text-gray-900">
                          {assignment.allowLateSubmission ? 'Allowed' : 'Not Allowed'}
                        </div>
                      </div>
                      {assignment.avgGrade > 0 && (
                        <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                          <div className="text-xs text-gray-600 mb-1">Average Grade</div>
                          <div className="text-sm font-semibold text-gray-900">{assignment.avgGrade}%</div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredAssignments.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-12 border border-white/20 shadow-lg text-center bg-white/40 backdrop-blur-md"
        >
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Assignments Found</h3>
          <p className="text-gray-600 mb-6">
            {searchQuery || filterSubject !== 'all'
              ? 'Try adjusting your filters or search query'
              : 'Create your first assignment to get started'}
          </p>
          {viewMode === 'teacher' && !searchQuery && filterSubject === 'all' && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCreateAssignment}
              className="px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl font-semibold hover:from-violet-700 hover:to-purple-700 transition-all shadow-md inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Create First Assignment
            </motion.button>
          )}
        </motion.div>
      )}

      <AssignmentModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSave={handleSaveAssignment}
        editingAssignment={selectedAssignment}
      />
    </div>
  );
};
