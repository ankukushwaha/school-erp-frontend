import { useState } from 'react';
import {
  ArrowLeft,
  FileText,
  Plus,
  Edit2,
  Trash2,
  BookOpen,
  Search,
  ChevronDown,
  Download,
  Eye,
  CheckCircle2,
  Clock,
  AlertCircle,
  User,
  Paperclip,
  LayoutGrid
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { HomeworkModal } from '@/components/modal/academics/HomeworkModal';

interface Assignment {
  id: number;
  title: string;
  description: string;
  classId: number;
  className: string;
  sectionName: string;
  subjectId: number;
  subjectName: string;
  teacherId: number;
  teacherName: string;
  assignedDate: string;
  dueDate: string;
  totalMarks: number;
  attachments: string[];
  status: 'Active' | 'Completed' | 'Overdue';
  submissions: number;
  totalStudents: number;
  graded: number;
}

const mockAssignments: Assignment[] = [
  {
    id: 1,
    title: 'Quadratic Equations - Problem Set',
    description: 'Solve all 20 problems from Chapter 4. Show complete working for each problem.',
    classId: 10,
    className: 'Class 10',
    sectionName: 'A',
    subjectId: 1,
    subjectName: 'Mathematics',
    teacherId: 101,
    teacherName: 'Mr. Anderson',
    assignedDate: '2024-02-01',
    dueDate: '2024-02-08',
    totalMarks: 50,
    attachments: ['problem_set.pdf'],
    status: 'Active',
    submissions: 25,
    totalStudents: 30,
    graded: 20
  },
  {
    id: 2,
    title: 'Chemical Reactions Lab Report',
    description: 'Write a detailed lab report on the chemical reactions experiment conducted in class. Include observations, results, and conclusions.',
    classId: 10,
    className: 'Class 10',
    sectionName: 'A',
    subjectId: 2,
    subjectName: 'Chemistry',
    teacherId: 103,
    teacherName: 'Mr. Brown',
    assignedDate: '2024-02-03',
    dueDate: '2024-02-10',
    totalMarks: 30,
    attachments: ['lab_template.docx', 'rubric.pdf'],
    status: 'Active',
    submissions: 18,
    totalStudents: 30,
    graded: 10
  },
  {
    id: 3,
    title: 'Essay: The Road Not Taken Analysis',
    description: 'Write a 500-word essay analyzing the themes and literary devices in Robert Frost\'s poem.',
    classId: 10,
    className: 'Class 10',
    sectionName: 'B',
    subjectId: 3,
    subjectName: 'English',
    teacherId: 104,
    teacherName: 'Ms. Wilson',
    assignedDate: '2024-01-28',
    dueDate: '2024-02-05',
    totalMarks: 25,
    attachments: ['poem.pdf', 'essay_guidelines.pdf'],
    status: 'Overdue',
    submissions: 28,
    totalStudents: 29,
    graded: 28
  },
  {
    id: 4,
    title: 'World War II Research Project',
    description: 'Research and create a presentation on a specific aspect of World War II. Minimum 10 slides.',
    classId: 10,
    className: 'Class 10',
    sectionName: 'A',
    subjectId: 4,
    subjectName: 'History',
    teacherId: 105,
    teacherName: 'Mr. Taylor',
    assignedDate: '2024-01-20',
    dueDate: '2024-02-03',
    totalMarks: 40,
    attachments: ['research_guidelines.pdf'],
    status: 'Completed',
    submissions: 30,
    totalStudents: 30,
    graded: 30
  },
];

const mockClasses = [
  { id: 1, name: 'Class 1', sections: ['A', 'B', 'C'] },
  { id: 10, name: 'Class 10', sections: ['A', 'B', 'C'] },
  { id: 12, name: 'Class 12', sections: ['A', 'B'] },
];

const mockSubjects = [
  { id: 1, name: 'Mathematics' },
  { id: 2, name: 'Chemistry' },
  { id: 3, name: 'English' },
  { id: 4, name: 'History' },
  { id: 5, name: 'Physics' },
];

const mockTeachers = [
  { id: 101, name: 'Mr. Anderson' },
  { id: 102, name: 'Mrs. Davis' },
  { id: 103, name: 'Mr. Brown' },
  { id: 104, name: 'Ms. Wilson' },
  { id: 105, name: 'Mr. Taylor' },
];

export const HomeworkManagementPage = () => {
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState(mockAssignments);
  const [showForm, setShowForm] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterClass, setFilterClass] = useState('all');

  const calculateStatus = (dueDate: string, submissions: number, totalStudents: number): 'Active' | 'Completed' | 'Overdue' => {
    const today = new Date();
    const due = new Date(dueDate);

    if (submissions === totalStudents) return 'Completed';
    if (due < today) return 'Overdue';
    return 'Active';
  };

  const handleSave = (data: any) => {
    const classInfo = mockClasses.find(c => c.id === parseInt(data.selectedClassId));
    const subjectInfo = mockSubjects.find(s => s.id === parseInt(data.selectedSubjectId));
    const teacherInfo = mockTeachers.find(t => t.id === parseInt(data.selectedTeacherId));

    const status = calculateStatus(data.dueDate, editingAssignment?.submissions || 0, editingAssignment?.totalStudents || 30);

    if (editingAssignment) {
      setAssignments(assignments.map(assignment =>
        assignment.id === editingAssignment.id
          ? {
            ...assignment,
            title: data.title,
            description: data.description,
            classId: parseInt(data.selectedClassId),
            className: classInfo?.name || '',
            sectionName: data.selectedSection,
            subjectId: parseInt(data.selectedSubjectId),
            subjectName: subjectInfo?.name || '',
            teacherId: parseInt(data.selectedTeacherId),
            teacherName: teacherInfo?.name || '',
            assignedDate: data.assignedDate,
            dueDate: data.dueDate,
            totalMarks: parseInt(data.totalMarks),
            attachments: data.attachments,
            status
          }
          : assignment
      ));
    } else {
      const newAssignment: Assignment = {
        id: Date.now(),
        title: data.title,
        description: data.description,
        classId: parseInt(data.selectedClassId),
        className: classInfo?.name || '',
        sectionName: data.selectedSection,
        subjectId: parseInt(data.selectedSubjectId),
        subjectName: subjectInfo?.name || '',
        teacherId: parseInt(data.selectedTeacherId),
        teacherName: teacherInfo?.name || '',
        assignedDate: data.assignedDate,
        dueDate: data.dueDate,
        totalMarks: parseInt(data.totalMarks),
        attachments: data.attachments,
        status,
        submissions: 0,
        totalStudents: 30,
        graded: 0
      };
      setAssignments([...assignments, newAssignment].sort((a, b) =>
        new Date(b.assignedDate).getTime() - new Date(a.assignedDate).getTime()
      ));
    }
    setShowForm(false);
    setEditingAssignment(null);
  };

  const editAssignment = (assignment: Assignment) => {
    setEditingAssignment(assignment);
    setShowForm(true);
  };

  const deleteAssignment = (id: number) => {
    if (confirm('Are you sure you want to delete this assignment?')) {
      setAssignments(assignments.filter(assignment => assignment.id !== id));
    }
  };

  const filteredAssignments = assignments.filter(assignment => {
    const matchesSearch = assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.subjectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || assignment.status.toLowerCase() === filterStatus.toLowerCase();
    const matchesClass = filterClass === 'all' || assignment.classId === parseInt(filterClass);
    return matchesSearch && matchesStatus && matchesClass;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Active':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Overdue':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle2 size={16} />;
      case 'Active':
        return <Clock size={16} />;
      case 'Overdue':
        return <AlertCircle size={16} />;
      default:
        return <Clock size={16} />;
    }
  };

  const totalSubmissions = assignments.reduce((acc, a) => acc + a.submissions, 0);
  const activeAssignments = assignments.filter(a => a.status === 'Active').length;
  const overdueAssignments = assignments.filter(a => a.status === 'Overdue').length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/academics')}
            className="p-2 bg-white/40 hover:bg-white/60 rounded-full transition-colors text-gray-600 shadow-sm border border-white/20"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Homework & Assignments</h1>
            <p className="text-sm text-gray-500 mt-1">Create and manage assignments for students</p>
          </div>
        </div>
        <button
          onClick={() => {
            setEditingAssignment(null);
            setShowForm(true);
          }}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2"
        >
          <Plus size={18} />
          Create Assignment
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white/40 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
              <FileText size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Assignments</p>
              <p className="text-2xl font-bold text-gray-800">{assignments.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white/40 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <Clock size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Active</p>
              <p className="text-2xl font-bold text-gray-800">{activeAssignments}</p>
            </div>
          </div>
        </div>
        <div className="bg-white/40 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Submissions</p>
              <p className="text-2xl font-bold text-gray-800">{totalSubmissions}</p>
            </div>
          </div>
        </div>
        <div className="bg-white/40 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
              <AlertCircle size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Overdue</p>
              <p className="text-2xl font-bold text-gray-800">{overdueAssignments}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search assignments..."
            className="w-full pl-12 pr-4 py-3 bg-white/50 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-sm transition-all"
          />
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="appearance-none pl-4 pr-10 py-3 bg-white/50 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-gray-700 font-medium min-w-[150px] shadow-sm cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="overdue">Overdue</option>
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
          </div>
          <div className="relative">
            <select
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
              className="appearance-none pl-4 pr-10 py-3 bg-white/50 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-gray-700 font-medium min-w-[150px] shadow-sm cursor-pointer"
            >
              <option value="all">All Classes</option>
              {mockClasses.map(cls => (
                <option key={cls.id} value={cls.id}>{cls.name}</option>
              ))}
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Assignments List */}
      <div className="space-y-4">
        {filteredAssignments.map((assignment) => {
          const submissionPercentage = (assignment.submissions / assignment.totalStudents) * 100;
          const gradedPercentage = (assignment.graded / assignment.submissions) * 100;

          return (
            <div
              key={assignment.id}
              className="bg-white/40 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg hover:bg-white/60 transition-all group"
            >
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Main Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-800">{assignment.title}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border-2 flex items-center gap-1.5 ${getStatusColor(assignment.status)}`}>
                          {getStatusIcon(assignment.status)}
                          {assignment.status.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{assignment.description}</p>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1.5 bg-white/50 px-2.5 py-1 rounded-lg">
                          <BookOpen size={16} className="text-indigo-500" />
                          {assignment.subjectName}
                        </span>
                        <span className="flex items-center gap-1.5 bg-white/50 px-2.5 py-1 rounded-lg">
                          <User size={16} className="text-emerald-500" />
                          {assignment.teacherName}
                        </span>
                        <span className="flex items-center gap-1.5 bg-white/50 px-2.5 py-1 rounded-lg">
                          <LayoutGrid size={16} className="text-amber-500" />
                          {assignment.className} - {assignment.sectionName}
                        </span>
                        <span className="font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">
                          Marks: {assignment.totalMarks}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => editAssignment(assignment)}
                        className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-white rounded-lg transition-colors shadow-sm"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => deleteAssignment(assignment.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-white rounded-lg transition-colors shadow-sm"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Attachments */}
                  {assignment.attachments.length > 0 && (
                    <div className="mb-4">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Attachments</p>
                      <div className="flex flex-wrap gap-2">
                        {assignment.attachments.map((file, idx) => (
                          <div key={idx} className="flex items-center gap-2 px-3 py-1.5 bg-white/50 text-indigo-700 rounded-xl text-sm border border-indigo-100 group/file cursor-pointer hover:bg-indigo-50 transition-all">
                            <Paperclip size={14} className="text-indigo-400" />
                            <span className="font-medium">{file}</span>
                            <Download size={14} className="text-indigo-400 group-hover/file:text-indigo-600" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Dates */}
                  <div className="flex items-center gap-8 pt-4 border-t border-gray-100">
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Assigned Date</p>
                      <p className="text-sm font-bold text-gray-700 mt-0.5">
                        {new Date(assignment.assignedDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Due Date</p>
                      <p className="text-sm font-bold text-red-600 mt-0.5">
                        {new Date(assignment.dueDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Progress Section */}
                <div className="w-full lg:w-80 space-y-4">
                  <div className="bg-white/60 rounded-2xl p-5 border border-white/20 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-bold text-gray-700">Submissions</span>
                      <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg">
                        {assignment.submissions} / {assignment.totalStudents}
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all shadow-sm"
                        style={{ width: `${submissionPercentage}%` }}
                      />
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Completion Rate</p>
                      <p className="text-xs font-bold text-indigo-600">{Math.round(submissionPercentage)}%</p>
                    </div>
                  </div>

                  <div className="bg-white/60 rounded-2xl p-5 border border-white/20 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-bold text-gray-700">Graded Status</span>
                      <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg">
                        {assignment.graded} / {assignment.submissions}
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all shadow-sm"
                        style={{ width: `${isNaN(gradedPercentage) ? 0 : gradedPercentage}%` }}
                      />
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Grading Progress</p>
                      <p className="text-xs font-bold text-emerald-600">
                        {isNaN(gradedPercentage) ? 0 : Math.round(gradedPercentage)}%
                      </p>
                    </div>
                  </div>

                  <button className="w-full px-4 py-3 bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 active:scale-95">
                    <Eye size={18} />
                    View Submissions
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <HomeworkModal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        onSave={handleSave}
        editingAssignment={editingAssignment}
        mockClasses={mockClasses}
        mockSubjects={mockSubjects}
        mockTeachers={mockTeachers}
      />
    </div>
  );
};
