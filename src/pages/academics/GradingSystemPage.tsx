import { useState } from 'react';
import { 
  Award,
  Plus,
  Edit2,
  Trash2,
  BookOpen,
  Save,
  X,
  Settings,
  TrendingUp,
  Target,
  BarChart3,
  Calculator,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  ChevronDown
} from 'lucide-react';
import { useNavigate } from 'react-router';

// Mock Data
const mockGradeScales = [
  { 
    id: 1, 
    name: 'Standard Grade Scale', 
    type: 'Letter', 
    isDefault: true,
    grades: [
      { letter: 'A+', minPercent: 90, maxPercent: 100, gpa: 4.0, description: 'Outstanding' },
      { letter: 'A', minPercent: 85, maxPercent: 89, gpa: 3.7, description: 'Excellent' },
      { letter: 'B+', minPercent: 80, maxPercent: 84, gpa: 3.3, description: 'Very Good' },
      { letter: 'B', minPercent: 75, maxPercent: 79, gpa: 3.0, description: 'Good' },
      { letter: 'C+', minPercent: 70, maxPercent: 74, gpa: 2.7, description: 'Above Average' },
      { letter: 'C', minPercent: 65, maxPercent: 69, gpa: 2.3, description: 'Average' },
      { letter: 'D', minPercent: 50, maxPercent: 64, gpa: 2.0, description: 'Pass' },
      { letter: 'F', minPercent: 0, maxPercent: 49, gpa: 0.0, description: 'Fail' }
    ]
  },
  { 
    id: 2, 
    name: 'Primary School Scale', 
    type: 'Descriptive', 
    isDefault: false,
    grades: [
      { letter: 'Excellent', minPercent: 85, maxPercent: 100, gpa: null, description: 'Excellent Performance' },
      { letter: 'Good', minPercent: 70, maxPercent: 84, gpa: null, description: 'Good Performance' },
      { letter: 'Satisfactory', minPercent: 55, maxPercent: 69, gpa: null, description: 'Needs Improvement' },
      { letter: 'Needs Work', minPercent: 0, maxPercent: 54, gpa: null, description: 'Requires Attention' }
    ]
  },
  { 
    id: 3, 
    name: 'IB Scale', 
    type: 'Numeric', 
    isDefault: false,
    grades: [
      { letter: '7', minPercent: 85, maxPercent: 100, gpa: 4.0, description: 'Excellent' },
      { letter: '6', minPercent: 75, maxPercent: 84, gpa: 3.5, description: 'Very Good' },
      { letter: '5', minPercent: 65, maxPercent: 74, gpa: 3.0, description: 'Good' },
      { letter: '4', minPercent: 55, maxPercent: 64, gpa: 2.5, description: 'Satisfactory' },
      { letter: '3', minPercent: 45, maxPercent: 54, gpa: 2.0, description: 'Mediocre' },
      { letter: '2', minPercent: 35, maxPercent: 44, gpa: 1.0, description: 'Poor' },
      { letter: '1', minPercent: 0, maxPercent: 34, gpa: 0.0, description: 'Very Poor' }
    ]
  }
];

const mockClassGradeAssignments = [
  { id: 1, className: 'Class 10', section: 'A', gradeScale: 'Standard Grade Scale', assignedBy: 'Admin' },
  { id: 2, className: 'Class 9', section: 'B', gradeScale: 'Standard Grade Scale', assignedBy: 'Admin' },
  { id: 3, className: 'Class 1', section: 'A', gradeScale: 'Primary School Scale', assignedBy: 'Admin' },
  { id: 4, className: 'Class 11', section: 'A', gradeScale: 'IB Scale', assignedBy: 'Admin' }
];

const mockGradeStatistics = [
  { class: 'Class 10-A', avgGPA: 3.2, avgPercent: 78, studentsAbove80: 15, studentsBelow50: 2, totalStudents: 35 },
  { class: 'Class 9-B', avgGPA: 2.8, avgPercent: 72, studentsAbove80: 10, studentsBelow50: 5, totalStudents: 32 }
];

export const GradingSystemPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'scales' | 'assignments' | 'calculator' | 'statistics'>('overview');
  const [showForm, setShowForm] = useState(false);
  const [expandedScaleId, setExpandedScaleId] = useState<number | null>(null);
  
  // Form states
  const [scaleName, setScaleName] = useState('');
  const [scaleType, setScaleType] = useState('Letter');
  const [calculatorPercent, setCalculatorPercent] = useState('');
  const [selectedCalculatorScale, setSelectedCalculatorScale] = useState('1');

  const resetForm = () => {
    setScaleName('');
    setScaleType('Letter');
    setShowForm(false);
  };

  const calculateGrade = () => {
    const percent = parseFloat(calculatorPercent);
    if (isNaN(percent) || percent < 0 || percent > 100) return null;
    
    const scale = mockGradeScales.find(s => s.id === parseInt(selectedCalculatorScale));
    if (!scale) return null;
    
    const grade = scale.grades.find(g => percent >= g.minPercent && percent <= g.maxPercent);
    return grade;
  };

  const calculatedGrade = calculateGrade();

  return (
    <div className="space-y-6">
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
            <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Grading System</h1>
            <p className="text-sm text-gray-500 mt-2">Configure grade scales, assign to classes, and analyze performance</p>
          </div>
        </div>
        {activeTab === 'scales' && (
          <button 
            onClick={() => setShowForm(true)}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2"
          >
            <Plus size={18} />
            Create Grade Scale
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex p-1 bg-white/40 backdrop-blur-md rounded-xl border border-white/30 w-fit overflow-x-auto shadow-sm">
        <button
          onClick={() => { setActiveTab('overview'); setShowForm(false); }}
          className={`px-6 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap ${ 
            activeTab === 'overview' 
              ? 'bg-white text-indigo-600 shadow-sm' 
              : 'text-gray-600 hover:bg-white/50'
          }`}
        >
          <Target size={16} />
          Overview
        </button>
        <button
          onClick={() => { setActiveTab('scales'); setShowForm(false); }}
          className={`px-6 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap ${ 
            activeTab === 'scales' 
              ? 'bg-white text-indigo-600 shadow-sm' 
              : 'text-gray-600 hover:bg-white/50'
          }`}
        >
          <Award size={16} />
          Grade Scales
        </button>
        <button
          onClick={() => { setActiveTab('assignments'); setShowForm(false); }}
          className={`px-6 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap ${ 
            activeTab === 'assignments' 
              ? 'bg-white text-indigo-600 shadow-sm' 
              : 'text-gray-600 hover:bg-white/50'
          }`}
        >
          <Settings size={16} />
          Class Assignments
        </button>
        <button
          onClick={() => { setActiveTab('calculator'); setShowForm(false); }}
          className={`px-6 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap ${ 
            activeTab === 'calculator' 
              ? 'bg-white text-indigo-600 shadow-sm' 
              : 'text-gray-600 hover:bg-white/50'
          }`}
        >
          <Calculator size={16} />
          Grade Calculator
        </button>
        <button
          onClick={() => { setActiveTab('statistics'); setShowForm(false); }}
          className={`px-6 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap ${ 
            activeTab === 'statistics' 
              ? 'bg-white text-indigo-600 shadow-sm' 
              : 'text-gray-600 hover:bg-white/50'
          }`}
        >
          <BarChart3 size={16} />
          Statistics
        </button>
      </div>

      {/* Overview - Quick Stats Cards */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <Award size={24} />
                </div>
                <p className="text-3xl font-bold">{mockGradeScales.length}</p>
              </div>
              <h3 className="text-lg font-bold">Grade Scales</h3>
              <p className="text-sm text-white/80 mt-1">Active grading systems</p>
            </div>

            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <BookOpen size={24} />
                </div>
                <p className="text-3xl font-bold">{mockClassGradeAssignments.length}</p>
              </div>
              <h3 className="text-lg font-bold">Class Assignments</h3>
              <p className="text-sm text-white/80 mt-1">Classes configured</p>
            </div>

            <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-6 text-white shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <TrendingUp size={24} />
                </div>
                <p className="text-3xl font-bold">3.0</p>
              </div>
              <h3 className="text-lg font-bold">Average GPA</h3>
              <p className="text-sm text-white/80 mt-1">School-wide average</p>
            </div>

            <div className="bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl p-6 text-white shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <Target size={24} />
                </div>
                <p className="text-3xl font-bold">75%</p>
              </div>
              <h3 className="text-lg font-bold">Pass Rate</h3>
              <p className="text-sm text-white/80 mt-1">Overall success rate</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <button
              onClick={() => setActiveTab('scales')}
              className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all text-left group active:scale-[0.98]"
            >
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
                  <Award size={24} />
                </div>
                <h3 className="text-lg font-bold text-gray-800">Manage Grade Scales</h3>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">Create and edit grading systems for different academic levels and curricula.</p>
            </button>

            <button
              onClick={() => setActiveTab('assignments')}
              className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all text-left group active:scale-[0.98]"
            >
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                  <Settings size={24} />
                </div>
                <h3 className="text-lg font-bold text-gray-800">Assign to Classes</h3>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">Configure specific grade scales for different classes and sections across the school.</p>
            </button>

            <button
              onClick={() => setActiveTab('calculator')}
              className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all text-left group active:scale-[0.98]"
            >
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform">
                  <Calculator size={24} />
                </div>
                <h3 className="text-lg font-bold text-gray-800">Grade Calculator</h3>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">Quickly convert percentage marks to letter grades and GPA based on active scales.</p>
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Grade Scales List */}
        {activeTab === 'scales' && !showForm && (
          <div className="flex-1 space-y-4 animate-in fade-in duration-300">
            {mockGradeScales.map((scale) => (
              <div key={scale.id} className="bg-white/60 backdrop-blur-xl rounded-2xl border border-white/20 shadow-lg overflow-hidden group transition-all hover:bg-white/80">
                {/* Scale Header */}
                <div className="p-6 border-b border-gray-100/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-100 transition-colors">
                        <Award size={24} />
                      </div>
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-bold text-gray-800">{scale.name}</h3>
                          {scale.isDefault && (
                            <span className="px-2 py-0.5 bg-indigo-100 text-indigo-600 text-[10px] font-black rounded-lg uppercase tracking-wider">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 mt-0.5 font-medium">Type: {scale.type} Grade System</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setExpandedScaleId(expandedScaleId === scale.id ? null : scale.id)}
                        className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 transition-all active:scale-95 shadow-sm"
                      >
                        {expandedScaleId === scale.id ? 'Hide Detail' : 'View Detail'}
                      </button>
                      <button className="p-2.5 text-gray-400 hover:text-indigo-600 hover:bg-white rounded-xl transition-all active:scale-90 border border-transparent hover:border-gray-100">
                        <Edit2 size={18} />
                      </button>
                      <button className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-white rounded-xl transition-all active:scale-90 border border-transparent hover:border-gray-100">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Grade Details Table - Expandable */}
                {expandedScaleId === scale.id && (
                  <div className="overflow-x-auto animate-in slide-in-from-top-2 duration-200">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50/50 border-b border-gray-100">
                        <tr>
                          <th className="px-8 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Grade</th>
                          <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Min %</th>
                          <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Max %</th>
                          {scale.type !== 'Descriptive' && (
                            <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">GPA</th>
                          )}
                          <th className="px-8 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Description</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100/50">
                        {scale.grades.map((grade, idx) => (
                          <tr key={idx} className="hover:bg-white/40 transition-colors">
                            <td className="px-8 py-4">
                              <span className="inline-flex items-center justify-center min-w-[3.5rem] px-3 py-1.5 bg-indigo-50 text-indigo-700 font-black rounded-xl text-sm border border-indigo-100 shadow-sm">
                                {grade.letter}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-gray-700 font-bold">{grade.minPercent}%</td>
                            <td className="px-6 py-4 text-gray-700 font-bold">{grade.maxPercent}%</td>
                            {scale.type !== 'Descriptive' && (
                              <td className="px-6 py-4 text-indigo-600 font-black text-lg">{grade.gpa?.toFixed(1)}</td>
                            )}
                            <td className="px-8 py-4 text-gray-500 font-medium italic">"{grade.description}"</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Class Assignments Tab */}
        {activeTab === 'assignments' && (
          <div className="flex-1 animate-in fade-in duration-300">
            <div className="bg-white/60 backdrop-blur-xl rounded-2xl border border-white/20 shadow-lg overflow-hidden">
              <div className="p-8 border-b border-gray-100/50">
                <h3 className="text-xl font-bold text-gray-800">Grade Scale Assignments</h3>
                <p className="text-sm text-gray-500 mt-1">Directly manage which grade scales apply to specific classes.</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50/50 border-b border-gray-100">
                    <tr>
                      <th className="px-8 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Class</th>
                      <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Section</th>
                      <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Grade Scale</th>
                      <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Assigned By</th>
                      <th className="px-8 py-4 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100/50">
                    {mockClassGradeAssignments.map((assignment) => (
                      <tr key={assignment.id} className="hover:bg-white/40 transition-colors group">
                        <td className="px-8 py-5">
                           <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center font-black text-gray-500 mb-1 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                              {assignment.className.split(' ')[1]}
                           </div>
                           <span className="font-black text-gray-800">{assignment.className}</span>
                        </td>
                        <td className="px-6 py-5">
                           <span className="w-8 h-8 rounded-full bg-white border border-gray-100 flex items-center justify-center font-bold text-gray-600 shadow-sm">
                              {assignment.section}
                           </span>
                        </td>
                        <td className="px-6 py-5">
                          <span className="px-4 py-2 bg-indigo-50 text-indigo-600 text-xs font-black rounded-xl border border-indigo-100 shadow-sm uppercase tracking-wide">
                            {assignment.gradeScale}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                           <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-indigo-100" />
                              <span className="text-gray-500 font-bold">{assignment.assignedBy}</span>
                           </div>
                        </td>
                        <td className="px-8 py-5 text-right">
                          <button className="px-3 py-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg font-black text-[10px] uppercase tracking-wider transition-colors mr-2">
                            Edit
                          </button>
                          <button className="px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-lg font-black text-[10px] uppercase tracking-wider transition-colors">
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Grade Calculator Tab */}
        {activeTab === 'calculator' && (
          <div className="flex-1 animate-in fade-in duration-300">
            <div className="max-w-2xl mx-auto">
              <div className="bg-white/60 backdrop-blur-xl rounded-[2.5rem] border border-white/20 shadow-xl p-10">
                <div className="flex items-center gap-6 mb-10">
                  <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-indigo-200">
                    <Calculator size={36} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-gray-800 tracking-tight">Grade Calculator</h3>
                    <p className="text-sm text-gray-500 mt-1 font-medium italic">Instant score translation & GPA lookup</p>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Select Active Grade Scale</label>
                    <div className="relative">
                       <select
                        value={selectedCalculatorScale}
                        onChange={(e) => setSelectedCalculatorScale(e.target.value)}
                        className="appearance-none w-full px-6 py-4 bg-white/80 border-2 border-gray-50 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-gray-700 shadow-sm"
                      >
                        {mockGradeScales.map(scale => (
                          <option key={scale.id} value={scale.id}>{scale.name}</option>
                        ))}
                      </select>
                      <ChevronDown size={20} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Assessment Percentage Score</label>
                    <div className="relative">
                       <input
                        type="number"
                        value={calculatorPercent}
                        onChange={(e) => setCalculatorPercent(e.target.value)}
                        placeholder="0 — 100"
                        min="0"
                        max="100"
                        className="w-full px-8 py-6 bg-white/80 border-2 border-gray-50 rounded-[2rem] focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 text-5xl font-black text-center text-indigo-600 shadow-inner"
                      />
                      <span className="absolute right-8 top-1/2 -translate-y-1/2 text-3xl font-black text-gray-200">%</span>
                    </div>
                  </div>

                  {calculatedGrade && (
                    <div className="mt-10 p-8 bg-gray-900 rounded-[2.5rem] text-white shadow-2xl animate-in zoom-in-95 duration-300 relative overflow-hidden">
                       <div className="absolute top-0 left-0 w-full h-full opacity-5 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none" />
                      <div className="flex items-center gap-2 mb-6 relative z-10">
                        <CheckCircle2 size={18} className="text-emerald-400" />
                        <p className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em]">Calculation Result</p>
                      </div>
                      <div className="grid grid-cols-2 gap-6 relative z-10">
                        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 text-center">
                          <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-2">Alpha Grade</p>
                          <p className="text-5xl font-black text-white tracking-tighter">{calculatedGrade.letter}</p>
                        </div>
                        {calculatedGrade.gpa !== null && (
                          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 text-center">
                            <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-2">GPA Value</p>
                            <p className="text-5xl font-black text-indigo-400 tracking-tighter">{calculatedGrade.gpa.toFixed(1)}</p>
                          </div>
                        )}
                      </div>
                      <div className="mt-6 pt-6 border-t border-white/10 relative z-10 flex items-center justify-between">
                         <div>
                            <p className="text-lg font-black text-white tracking-tight uppercase">{calculatedGrade.description}</p>
                            <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mt-1">
                              Valid Range: {calculatedGrade.minPercent}% — {calculatedGrade.maxPercent}%
                            </p>
                         </div>
                         <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                            <Award size={24} className="text-amber-400" />
                         </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Statistics Tab */}
        {activeTab === 'statistics' && (
          <div className="flex-1 space-y-8 animate-in fade-in duration-300">
            <div className="bg-white/60 backdrop-blur-xl rounded-[2.5rem] border border-white/20 shadow-lg p-10">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 border border-emerald-100 shadow-sm">
                  <BarChart3 size={32} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-gray-800 tracking-tight">Academic Analytics</h3>
                  <p className="text-sm text-gray-500 font-medium italic">Pattern analysis across all class tiers</p>
                </div>
              </div>

              <div className="overflow-hidden rounded-3xl border border-gray-100 shadow-sm">
                <table className="w-full text-sm">
                  <thead className="bg-gray-900 text-white">
                    <tr>
                      <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-widest">Tier/Class</th>
                      <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-widest">Index GPA</th>
                      <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-widest">Mean Score</th>
                      <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-widest">High Merit</th>
                      <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-widest">At Risk</th>
                      <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-widest">Cohort Size</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {mockGradeStatistics.map((stat, idx) => (
                      <tr key={idx} className="hover:bg-indigo-50/30 transition-colors group">
                        <td className="px-8 py-5">
                           <div className="font-black text-gray-800 text-base">{stat.class}</div>
                        </td>
                        <td className="px-6 py-5">
                          <span className={`inline-flex px-4 py-2 rounded-xl font-black text-lg shadow-sm border-2 ${
                            stat.avgGPA >= 3.0 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                            stat.avgGPA >= 2.0 ? 'bg-amber-50 text-amber-600 border-amber-100' : 
                            'bg-red-50 text-red-600 border-red-100'
                          }`}>
                            {stat.avgGPA.toFixed(1)}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-gray-700 font-black text-lg">{stat.avgPercent}%</td>
                        <td className="px-6 py-5">
                           <div className="flex items-center gap-2">
                              <TrendingUp size={16} className="text-emerald-500" />
                              <span className="text-emerald-600 font-black text-lg">{stat.studentsAbove80}</span>
                           </div>
                        </td>
                        <td className="px-6 py-5">
                           <div className="flex items-center gap-2">
                              <AlertCircle size={16} className="text-red-400" />
                              <span className="text-red-600 font-black text-lg">{stat.studentsBelow50}</span>
                           </div>
                        </td>
                        <td className="px-8 py-5">
                           <span className="px-3 py-1 bg-gray-100 rounded-lg text-gray-500 font-black text-xs uppercase tracking-widest border border-gray-200">
                              {stat.totalStudents} PAX
                           </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Visual Merit Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white/60 backdrop-blur-xl rounded-[2rem] p-10 border-2 border-emerald-100 shadow-xl shadow-emerald-50 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                   <Award size={100} />
                </div>
                <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-emerald-200">
                  <TrendingUp size={28} />
                </div>
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Academic Merit List</h4>
                <p className="text-4xl font-black text-emerald-600 tracking-tighter">25 Students</p>
                <p className="text-sm text-gray-500 mt-2 font-medium italic">GPA Distinction Tier (3.5+)</p>
              </div>

              <div className="bg-white/60 backdrop-blur-xl rounded-[2rem] p-10 border-2 border-indigo-100 shadow-xl shadow-indigo-50 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                   <Target size={100} />
                </div>
                <div className="w-14 h-14 bg-indigo-500 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-indigo-200">
                  <Target size={28} />
                </div>
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Standard Performance</h4>
                <p className="text-4xl font-black text-indigo-600 tracking-tighter">35 Students</p>
                <p className="text-sm text-gray-500 mt-2 font-medium italic">Proficient Tier (2.0 - 3.5)</p>
              </div>

              <div className="bg-white/60 backdrop-blur-xl rounded-[2rem] p-10 border-2 border-rose-100 shadow-xl shadow-rose-50 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                   <AlertCircle size={100} />
                </div>
                <div className="w-14 h-14 bg-rose-500 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-rose-200">
                  <AlertCircle size={28} />
                </div>
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Strategic Intervention</h4>
                <p className="text-4xl font-black text-rose-600 tracking-tighter">7 Students</p>
                <p className="text-sm text-gray-500 mt-2 font-medium italic">Below Minimum GPA ({"<"}2.0)</p>
              </div>
            </div>
          </div>
        )}

        {/* Create Grade Scale Side Form */}
        {showForm && activeTab === 'scales' && (
          <div className="w-full lg:w-[400px] bg-white/80 backdrop-blur-2xl rounded-[2.5rem] border-2 border-white shadow-2xl p-10 h-fit sticky top-6 animate-in slide-in-from-right-8 duration-500">
            <div className="flex items-center justify-between mb-8">
              <div>
                 <h3 className="text-xl font-black text-gray-800 uppercase tracking-tight">Blueprint Scale</h3>
                 <p className="text-xs font-medium text-gray-400 italic">Initialize a new grading framework</p>
              </div>
              <button onClick={resetForm} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
                <X size={20} />
              </button>
            </div>

            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); resetForm(); }}>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Scale Descriptor <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={scaleName}
                  onChange={(e) => setScaleName(e.target.value)}
                  placeholder="e.g. Cambridge IGCSE Standard"
                  className="w-full px-6 py-4 bg-white/50 border-2 border-gray-50 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-gray-700"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Valuation Type <span className="text-red-500">*</span></label>
                <div className="relative">
                   <select
                    value={scaleType}
                    onChange={(e) => setScaleType(e.target.value)}
                    className="appearance-none w-full px-6 py-4 bg-white/50 border-2 border-gray-50 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-gray-700 cursor-pointer"
                    required
                  >
                    <option value="Letter">Letter Notation (A+, B, C...)</option>
                    <option value="Numeric">Numeric Index (7, 6, 5...)</option>
                    <option value="Descriptive">Descriptive Insight (Good...)</option>
                  </select>
                   <ChevronDown size={18} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div className="p-6 bg-indigo-50 rounded-3xl border border-indigo-100">
                <p className="text-[11px] text-indigo-700 font-bold leading-relaxed">
                   <span className="uppercase text-xs block mb-1">PRO TIP</span>
                  After defining the blueprint, you can configure granular percentage tiers, GPA weights, and descriptive feedback for each grade level.
                </p>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 py-4 bg-white border-2 border-gray-100 rounded-2xl text-xs font-black uppercase tracking-widest text-gray-400 hover:text-gray-600 transition-all active:scale-95"
                >
                  Discard
                </button>
                <button
                  type="submit"
                  className="flex-[2] py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  <Save size={18} />
                  Build Scale
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
