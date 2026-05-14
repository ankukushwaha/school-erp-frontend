import { useState } from 'react';
import { 
  ArrowLeft, 
  TrendingUp,
  TrendingDown,
  Plus, 
  BookOpen,
  Calendar,
  Search,
  ChevronDown,
  Download,
  Printer,
  Eye,
  CheckCircle2,
  BarChart3,
  FileText,
  MessageSquare,
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { ReportCardModal } from '@/components/modal/academics/ReportCardModal';
import { ReportRemarksModal } from '@/components/modal/academics/ReportRemarksModal';

interface SubjectGrade {
  subjectId: number;
  subjectName: string;
  teacherName: string;
  theory: number;
  practical: number;
  internal: number;
  total: number;
  maxMarks: number;
  grade: string;
  remarks: string;
}

interface StudentReport {
  id: number;
  studentId: number;
  studentName: string;
  rollNumber: string;
  className: string;
  sectionName: string;
  examType: string;
  academicYear: string;
  term: string;
  subjects: SubjectGrade[];
  totalMarks: number;
  maxTotalMarks: number;
  percentage: number;
  rank: number;
  attendance: number;
  classTeacherRemarks: string;
  principalRemarks: string;
  status: 'Published' | 'Draft' | 'Under Review';
  generatedDate: string;
}

const mockReports: StudentReport[] = [
  {
    id: 1,
    studentId: 1001,
    studentName: 'John Smith',
    rollNumber: '10A-001',
    className: 'Class 10',
    sectionName: 'A',
    examType: 'Mid-Term Examination',
    academicYear: '2023-24',
    term: 'Term 1',
    subjects: [
      { subjectId: 1, subjectName: 'Mathematics', teacherName: 'Mr. Anderson', theory: 85, practical: 0, internal: 18, total: 103, maxMarks: 120, grade: 'A+', remarks: 'Excellent problem solving' },
      { subjectId: 2, subjectName: 'Physics', teacherName: 'Mrs. Davis', theory: 78, practical: 22, internal: 16, total: 116, maxMarks: 140, grade: 'A', remarks: 'Good lab work' },
      { subjectId: 3, subjectName: 'Chemistry', teacherName: 'Mr. Brown', theory: 82, practical: 20, internal: 17, total: 119, maxMarks: 140, grade: 'A+', remarks: 'Outstanding performance' },
      { subjectId: 4, subjectName: 'English', teacherName: 'Ms. Wilson', theory: 88, practical: 0, internal: 19, total: 107, maxMarks: 120, grade: 'A+', remarks: 'Excellent writing skills' },
      { subjectId: 5, subjectName: 'History', teacherName: 'Mr. Taylor', theory: 75, practical: 0, internal: 15, total: 90, maxMarks: 100, grade: 'A', remarks: 'Good understanding' },
    ],
    totalMarks: 535,
    maxTotalMarks: 620,
    percentage: 86.29,
    rank: 2,
    attendance: 95,
    classTeacherRemarks: 'John is a bright and dedicated student who consistently performs well across all subjects.',
    principalRemarks: 'Excellent performance. Keep up the good work!',
    status: 'Published',
    generatedDate: '2024-02-05'
  },
  {
    id: 2,
    studentId: 1002,
    studentName: 'Emma Johnson',
    rollNumber: '10A-002',
    className: 'Class 10',
    sectionName: 'A',
    examType: 'Mid-Term Examination',
    academicYear: '2023-24',
    term: 'Term 1',
    subjects: [
      { subjectId: 1, subjectName: 'Mathematics', teacherName: 'Mr. Anderson', theory: 92, practical: 0, internal: 20, total: 112, maxMarks: 120, grade: 'A+', remarks: 'Exceptional talent' },
      { subjectId: 2, subjectName: 'Physics', teacherName: 'Mrs. Davis', theory: 88, practical: 24, internal: 19, total: 131, maxMarks: 140, grade: 'A+', remarks: 'Brilliant understanding' },
      { subjectId: 3, subjectName: 'Chemistry', teacherName: 'Mr. Brown', theory: 90, practical: 23, internal: 19, total: 132, maxMarks: 140, grade: 'A+', remarks: 'Top of the class' },
      { subjectId: 4, subjectName: 'English', teacherName: 'Ms. Wilson', theory: 95, practical: 0, internal: 20, total: 115, maxMarks: 120, grade: 'A+', remarks: 'Outstanding expression' },
      { subjectId: 5, subjectName: 'History', teacherName: 'Mr. Taylor', theory: 85, practical: 0, internal: 18, total: 103, maxMarks: 100, grade: 'A+', remarks: 'Excellent analysis' },
    ],
    totalMarks: 593,
    maxTotalMarks: 620,
    percentage: 95.65,
    rank: 1,
    attendance: 98,
    classTeacherRemarks: 'Emma is an outstanding student with exceptional academic abilities and leadership qualities.',
    principalRemarks: 'Exemplary performance. A role model for peers!',
    status: 'Published',
    generatedDate: '2024-02-05'
  },
  {
    id: 3,
    studentId: 1003,
    studentName: 'Michael Brown',
    rollNumber: '10A-003',
    className: 'Class 10',
    sectionName: 'A',
    examType: 'Mid-Term Examination',
    academicYear: '2023-24',
    term: 'Term 1',
    subjects: [
      { subjectId: 1, subjectName: 'Mathematics', teacherName: 'Mr. Anderson', theory: 65, practical: 0, internal: 14, total: 79, maxMarks: 120, grade: 'B', remarks: 'Needs improvement' },
      { subjectId: 2, subjectName: 'Physics', teacherName: 'Mrs. Davis', theory: 58, practical: 18, internal: 13, total: 89, maxMarks: 140, grade: 'B', remarks: 'Fair understanding' },
      { subjectId: 3, subjectName: 'Chemistry', teacherName: 'Mr. Brown', theory: 62, practical: 17, internal: 14, total: 93, maxMarks: 140, grade: 'B', remarks: 'Average performance' },
      { subjectId: 4, subjectName: 'English', teacherName: 'Ms. Wilson', theory: 70, practical: 0, internal: 15, total: 85, maxMarks: 120, grade: 'B+', remarks: 'Good effort' },
      { subjectId: 5, subjectName: 'History', teacherName: 'Mr. Taylor', theory: 68, practical: 0, internal: 14, total: 82, maxMarks: 100, grade: 'B+', remarks: 'Satisfactory work' },
    ],
    totalMarks: 428,
    maxTotalMarks: 620,
    percentage: 69.03,
    rank: 15,
    attendance: 88,
    classTeacherRemarks: 'Michael needs to focus more on studies and improve attendance. Extra support recommended.',
    principalRemarks: 'Needs consistent effort to improve performance.',
    status: 'Under Review',
    generatedDate: '2024-02-05'
  }
];

const mockClasses = [
  { id: 1, name: 'Class 1', sections: ['A', 'B'] },
  { id: 10, name: 'Class 10', sections: ['A', 'B', 'C'] },
  { id: 12, name: 'Class 12', sections: ['A', 'B'] },
];

const examTypes = ['Mid-Term Examination', 'Final Examination', 'Unit Test', 'Annual Examination'];

export const ProgressReportPage = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState(mockReports);
  const [showReportCard, setShowReportCard] = useState(false);
  const [showRemarksModal, setShowRemarksModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState<StudentReport | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterExam, setFilterExam] = useState('all');

  const viewReportCard = (report: StudentReport) => {
    setSelectedReport(report);
    setShowReportCard(true);
  };

  const editRemarks = (report: StudentReport) => {
    setSelectedReport(report);
    setShowRemarksModal(true);
  };

  const handleSaveRemarks = (classRemarks: string, principalRemarks: string) => {
    if (!selectedReport) return;
    
    setReports(reports.map(r => 
      r.id === selectedReport.id 
        ? { ...r, classTeacherRemarks: classRemarks, principalRemarks }
        : r
    ));
    setShowRemarksModal(false);
    setSelectedReport(null);
  };

  const publishReport = (reportId: number) => {
    setReports(reports.map(r => 
      r.id === reportId 
        ? { ...r, status: 'Published' as const }
        : r
    ));
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          report.rollNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = filterClass === 'all' || report.className === filterClass;
    const matchesStatus = filterStatus === 'all' || report.status.toLowerCase() === filterStatus.toLowerCase();
    const matchesExam = filterExam === 'all' || report.examType === filterExam;
    return matchesSearch && matchesClass && matchesStatus && matchesExam;
  });

  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return 'text-green-700 bg-green-100';
    if (grade.startsWith('B')) return 'text-blue-700 bg-blue-100';
    if (grade.startsWith('C')) return 'text-yellow-700 bg-yellow-100';
    if (grade.startsWith('D')) return 'text-orange-700 bg-orange-100';
    return 'text-red-700 bg-red-100';
  };

  const getPerformanceIndicator = (percentage: number) => {
    if (percentage >= 90) return { color: 'text-green-600', icon: <TrendingUp size={20} />, label: 'Excellent' };
    if (percentage >= 75) return { color: 'text-blue-600', icon: <TrendingUp size={20} />, label: 'Good' };
    if (percentage >= 60) return { color: 'text-yellow-600', icon: <TrendingUp size={20} />, label: 'Average' };
    return { color: 'text-red-600', icon: <TrendingDown size={20} />, label: 'Needs Improvement' };
  };

  const avgPercentage = reports.length > 0 
    ? reports.reduce((acc, r) => acc + r.percentage, 0) / reports.length 
    : 0;
  
  const publishedCount = reports.filter(r => r.status === 'Published').length;
  const underReviewCount = reports.filter(r => r.status === 'Under Review').length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/academics')} 
            className="p-2 bg-white/40 hover:bg-white/60 rounded-full transition-colors text-gray-600 shadow-sm border border-white/10"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Student Progress Reports</h1>
            <p className="text-sm text-gray-500 mt-1">Generate and manage student report cards</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2.5 bg-white/50 hover:bg-white border border-white/40 rounded-xl text-gray-700 font-medium shadow-sm transition-all flex items-center gap-2 active:scale-95">
            <Download size={18} />
            Export All
          </button>
          <button className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2 active:scale-95">
            <Plus size={18} />
            Generate Report
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white/40 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
              <FileText size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Reports</p>
              <p className="text-2xl font-bold text-gray-800">{reports.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white/40 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Published</p>
              <p className="text-2xl font-bold text-gray-800">{publishedCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-white/40 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
              <Eye size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Under Review</p>
              <p className="text-2xl font-bold text-gray-800">{underReviewCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-white/40 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
              <BarChart3 size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Avg. Percentage</p>
              <p className="text-2xl font-bold text-gray-800">{avgPercentage.toFixed(1)}%</p>
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
            placeholder="Search by student name or roll number..." 
            className="w-full pl-12 pr-4 py-3 bg-white/50 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-sm transition-all"
          />
        </div>
        <div className="flex gap-3 flex-wrap">
          <div className="relative">
            <select 
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
              className="appearance-none pl-4 pr-10 py-3 bg-white/50 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-gray-700 font-medium min-w-[140px] shadow-sm cursor-pointer"
            >
              <option value="all">All Classes</option>
              {mockClasses.map(cls => (
                <option key={cls.id} value={cls.name}>{cls.name}</option>
              ))}
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
          </div>
          <div className="relative">
            <select 
              value={filterExam}
              onChange={(e) => setFilterExam(e.target.value)}
              className="appearance-none pl-4 pr-10 py-3 bg-white/50 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-gray-700 font-medium min-w-[180px] shadow-sm cursor-pointer"
            >
              <option value="all">All Examinations</option>
              {examTypes.map(exam => (
                <option key={exam} value={exam}>{exam}</option>
              ))}
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
          </div>
          <div className="relative">
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="appearance-none pl-4 pr-10 py-3 bg-white/50 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-gray-700 font-medium min-w-[140px] shadow-sm cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="under review">Under Review</option>
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {filteredReports.map((report) => {
          const performance = getPerformanceIndicator(report.percentage);
          
          return (
            <div 
              key={report.id} 
              className="bg-white/40 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg hover:bg-white/60 transition-all group"
            >
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Student Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-xl shadow-lg shadow-indigo-200">
                        {report.studentName.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">{report.studentName}</h3>
                        <p className="text-sm text-gray-500 font-medium">{report.rollNumber} • {report.className} - {report.sectionName}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="flex items-center gap-1.5 text-xs font-bold text-gray-400 uppercase tracking-wider">
                            <Calendar size={14} className="text-indigo-400" />
                            {report.examType}
                          </span>
                          <span className="flex items-center gap-1.5 text-xs font-bold text-gray-400 uppercase tracking-wider">
                            <BookOpen size={14} className="text-emerald-400" />
                            {report.term}
                          </span>
                        </div>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border-2 ${
                      report.status === 'Published' ? 'bg-green-50 text-green-700 border-green-100' :
                      report.status === 'Draft' ? 'bg-gray-50 text-gray-600 border-gray-100' :
                      'bg-amber-50 text-amber-700 border-amber-100'
                    }`}>
                      {report.status}
                    </span>
                  </div>

                  {/* Performance Summary */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white/60 rounded-2xl p-4 border border-white/20 shadow-sm group-hover:bg-indigo-50 transition-colors">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Marks</p>
                      <p className="text-lg font-bold text-gray-800">{report.totalMarks}<span className="text-gray-400 font-medium text-sm">/{report.maxTotalMarks}</span></p>
                    </div>
                    <div className="bg-white/60 rounded-2xl p-4 border border-white/20 shadow-sm group-hover:bg-emerald-50 transition-colors">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Percentage</p>
                      <p className="text-lg font-bold text-emerald-600">{report.percentage.toFixed(2)}%</p>
                    </div>
                    <div className="bg-white/60 rounded-2xl p-4 border border-white/20 shadow-sm group-hover:bg-amber-50 transition-colors">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Class Rank</p>
                      <p className="text-lg font-bold text-amber-600">#{report.rank}</p>
                    </div>
                    <div className="bg-white/60 rounded-2xl p-4 border border-white/20 shadow-sm group-hover:bg-blue-50 transition-colors">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Attendance</p>
                      <p className="text-lg font-bold text-blue-600">{report.attendance}%</p>
                    </div>
                  </div>

                  {/* Subject Grades Preview */}
                  <div className="mb-6">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Top Subject Performance</p>
                    <div className="flex flex-wrap gap-2">
                      {report.subjects.slice(0, 4).map((subject) => (
                        <div key={subject.subjectId} className="flex items-center gap-3 px-4 py-2 bg-white/80 rounded-xl border border-gray-100 shadow-sm hover:border-indigo-200 transition-all">
                          <span className="text-sm font-bold text-gray-700">{subject.subjectName}</span>
                          <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black ${getGradeColor(subject.grade)}`}>
                            {subject.grade}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-6 border-t border-gray-100/50">
                    <button 
                      onClick={() => viewReportCard(report)}
                      className="flex-1 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 active:scale-95"
                    >
                      <Eye size={18} />
                      View Full Report
                    </button>
                    <button 
                      onClick={() => editRemarks(report)}
                      className="px-6 py-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl font-bold transition-all flex items-center gap-2 active:scale-95"
                    >
                      <MessageSquare size={18} className="text-indigo-500" />
                      Add Remarks
                    </button>
                    {report.status !== 'Published' && (
                      <button 
                        onClick={() => publishReport(report.id)}
                        className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 active:scale-95"
                      >
                        <CheckCircle2 size={18} />
                        Publish
                      </button>
                    )}
                    <button className="p-3 text-gray-400 hover:text-indigo-600 hover:bg-white border border-transparent hover:border-gray-100 rounded-xl transition-all active:scale-90">
                      <Printer size={20} />
                    </button>
                  </div>
                </div>

                {/* Performance Visualizer */}
                <div className="w-full lg:w-72">
                  <div className="bg-white/60 rounded-3xl p-8 border border-white/20 shadow-sm h-full flex flex-col items-center justify-center text-center">
                    <div className={`w-24 h-24 rounded-full bg-white shadow-inner flex items-center justify-center mb-4 ${performance.color}`}>
                      {performance.icon}
                    </div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Academic Status</p>
                    <p className={`text-2xl font-black ${performance.color} tracking-tight`}>{performance.label.toUpperCase()}</p>
                    <div className="mt-6 w-full space-y-2">
                       <div className="flex justify-between items-center text-[10px] font-black text-gray-400 uppercase tracking-widest">
                          <span>Overall Score</span>
                          <span className={performance.color}>{report.percentage.toFixed(1)}%</span>
                       </div>
                      <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden shadow-inner">
                        <div 
                          className={`h-full transition-all duration-1000 ease-out shadow-sm ${
                            report.percentage >= 90 ? 'bg-gradient-to-r from-emerald-400 to-teal-500' :
                            report.percentage >= 75 ? 'bg-gradient-to-r from-blue-400 to-indigo-500' :
                            report.percentage >= 60 ? 'bg-gradient-to-r from-yellow-400 to-orange-500' :
                            'bg-gradient-to-r from-rose-400 to-red-500'
                          }`}
                          style={{ width: `${report.percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <ReportCardModal 
        isOpen={showReportCard}
        onClose={() => setShowReportCard(false)}
        report={selectedReport}
        getGradeColor={getGradeColor}
      />

      <ReportRemarksModal 
        isOpen={showRemarksModal}
        onClose={() => setShowRemarksModal(false)}
        onSave={handleSaveRemarks}
        report={selectedReport}
      />
    </div>
  );
};
