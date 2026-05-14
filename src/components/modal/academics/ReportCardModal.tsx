import React from 'react';
import { 
  X, 
  Download, 
  Printer, 
  Award, 
  Star, 
  Users, 
  BarChart3 
} from 'lucide-react';

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

interface ReportCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: StudentReport | null;
  getGradeColor: (grade: string) => string;
}

export const ReportCardModal: React.FC<ReportCardModalProps> = ({
  isOpen,
  onClose,
  report,
  getGradeColor,
}) => {
  if (!isOpen || !report) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-5xl max-h-[95vh] overflow-y-auto animate-in zoom-in-95 duration-300">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white p-10 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none" />
          <button 
            onClick={onClose} 
            className="absolute top-6 right-6 p-2 hover:bg-white/20 rounded-full transition-all active:scale-90 z-10"
          >
            <X size={28} />
          </button>
          <div className="text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-xs font-black uppercase tracking-widest mb-4">
              <Award size={14} /> Official Academic Record
            </div>
            <h2 className="text-5xl font-black mb-2 tracking-tighter">PROGRESS REPORT CARD</h2>
            <p className="text-indigo-100 font-bold uppercase tracking-widest text-sm">{report.examType} • SESSION {report.academicYear}</p>
          </div>
        </div>

        <div className="p-12">
          {/* Student Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12 bg-gray-50/50 p-8 rounded-3xl border border-gray-100 shadow-inner">
            <div className="space-y-1">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Student Name</p>
              <p className="text-lg font-black text-gray-800">{report.studentName}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Enrollment No.</p>
              <p className="text-lg font-black text-gray-800">{report.rollNumber}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Class / Section</p>
              <p className="text-lg font-black text-gray-800">{report.className} — {report.sectionName}</p>
            </div>
            <div className="space-y-1 text-right">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Rank in Class</p>
              <p className="text-3xl font-black text-indigo-600">#{report.rank}</p>
            </div>
          </div>

          {/* Performance Table */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-black text-gray-800 flex items-center gap-3">
                <BarChart3 className="text-indigo-500" />
                Scholastic Performance
              </h3>
            </div>
            <div className="overflow-hidden rounded-3xl border border-gray-200 shadow-sm">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-900 text-white">
                    <th className="px-6 py-5 text-left text-xs font-black uppercase tracking-widest">Subject Description</th>
                    <th className="px-6 py-5 text-center text-xs font-black uppercase tracking-widest">Theory</th>
                    <th className="px-6 py-5 text-center text-xs font-black uppercase tracking-widest">Prac.</th>
                    <th className="px-6 py-5 text-center text-xs font-black uppercase tracking-widest">Internal</th>
                    <th className="px-6 py-5 text-center text-xs font-black uppercase tracking-widest">Total</th>
                    <th className="px-6 py-5 text-center text-xs font-black uppercase tracking-widest">Grade</th>
                    <th className="px-6 py-5 text-left text-xs font-black uppercase tracking-widest">Teacher Insights</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {report.subjects.map((subject, idx) => (
                    <tr key={subject.subjectId} className={`group hover:bg-indigo-50/30 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                      <td className="px-6 py-5">
                        <div className="font-bold text-gray-800">{subject.subjectName}</div>
                        <div className="text-[10px] text-gray-400 uppercase font-bold">{subject.teacherName}</div>
                      </td>
                      <td className="px-6 py-5 text-center font-medium text-gray-700">{subject.theory}</td>
                      <td className="px-6 py-5 text-center font-medium text-gray-700">{subject.practical || '—'}</td>
                      <td className="px-6 py-5 text-center font-medium text-gray-700">{subject.internal}</td>
                      <td className="px-6 py-5 text-center">
                        <div className="font-black text-gray-800">{subject.total}</div>
                        <div className="text-[10px] text-gray-400 font-bold">OUT OF {subject.maxMarks}</div>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <span className={`px-4 py-1.5 rounded-xl text-xs font-black shadow-sm ${getGradeColor(subject.grade)}`}>
                          {subject.grade}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-sm italic text-gray-500 font-medium">{subject.remarks}</td>
                    </tr>
                  ))}
                  <tr className="bg-gray-900 text-white">
                    <td colSpan={4} className="px-6 py-6 text-sm font-black uppercase tracking-[0.2em]">Grand Total Score</td>
                    <td className="px-6 py-6 text-center">
                      <div className="text-2xl font-black text-indigo-400">{report.totalMarks}</div>
                      <div className="text-[10px] font-black text-white/50 tracking-widest uppercase">OUT OF {report.maxTotalMarks}</div>
                    </td>
                    <td colSpan={2} className="px-6 py-6 text-right pr-10">
                      <div className="text-3xl font-black text-emerald-400">{report.percentage.toFixed(2)}%</div>
                      <div className="text-[10px] font-black text-white/50 tracking-widest uppercase text-right">OVERALL PERCENTAGE</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Bottom Visual Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-indigo-50/50 rounded-[2rem] p-8 border border-indigo-100 flex flex-col items-center justify-center text-center">
              <Award className="text-indigo-600 mb-3" size={48} />
              <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-1">Academic Ranking</h4>
              <p className="text-4xl font-black text-gray-800">Rank #{report.rank}</p>
            </div>
            <div className="bg-emerald-50/50 rounded-[2rem] p-8 border border-emerald-100 flex flex-col items-center justify-center text-center">
              <Star className="text-emerald-600 mb-3" size={48} />
              <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-1">Overall Grade</h4>
              <p className="text-4xl font-black text-gray-800">GRADE A+</p>
            </div>
            <div className="bg-blue-50/50 rounded-[2rem] p-8 border border-blue-100 flex flex-col items-center justify-center text-center">
              <Users className="text-blue-600 mb-3" size={48} />
              <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-1">Class Attendance</h4>
              <p className="text-4xl font-black text-gray-800">{report.attendance}%</p>
            </div>
          </div>

          {/* Professional Remarks Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="p-8 bg-white rounded-3xl border-2 border-dashed border-gray-200">
              <h5 className="flex items-center gap-2 text-sm font-black text-gray-400 uppercase tracking-widest mb-4">
                <Users size={16} className="text-indigo-500" />
                Class Teacher Observations
              </h5>
              <p className="text-gray-700 font-medium leading-relaxed italic">"{report.classTeacherRemarks}"</p>
            </div>
            <div className="p-8 bg-white rounded-3xl border-2 border-dashed border-gray-200">
              <h5 className="flex items-center gap-2 text-sm font-black text-gray-400 uppercase tracking-widest mb-4">
                <Star size={16} className="text-amber-500" />
                Principal's Remarks
              </h5>
              <p className="text-gray-700 font-medium leading-relaxed italic">"{report.principalRemarks}"</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="flex-[2] py-5 bg-gray-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center gap-3 shadow-xl active:scale-[0.98]">
              <Download size={22} />
              Download Secure Transcript (PDF)
            </button>
            <button className="flex-1 py-5 bg-white border-2 border-gray-900 text-gray-900 rounded-2xl font-black uppercase tracking-widest hover:bg-gray-50 transition-all flex items-center justify-center gap-3 active:scale-[0.98]">
              <Printer size={22} />
              Print
            </button>
            <button 
              onClick={onClose}
              className="flex-1 py-5 bg-gray-100 text-gray-500 rounded-2xl font-black uppercase tracking-widest hover:bg-gray-200 transition-all active:scale-[0.98]"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
