import { useState } from 'react';
import {
  ArrowLeft,
  BookMarked,
  Plus,
  Edit2,
  Trash2,
  FileText,
  Search,
  ChevronDown,
  Download,
  CheckCircle2,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SyllabusManagementModal } from '@/components/modal/academics/SyllabusManagementModal';

interface SyllabusItem {
  id: number;
  subjectId: number;
  subjectName: string;
  classId: number;
  className: string;
  term: string;
  totalTopics: number;
  completedTopics: number;
  status: 'On Track' | 'Behind' | 'Completed';
  lastUpdated: string;
  document?: string;
}

const mockSyllabus: SyllabusItem[] = [
  { id: 1, subjectId: 1, subjectName: 'Mathematics', classId: 10, className: 'Class 10', term: 'Term 1', totalTopics: 15, completedTopics: 14, status: 'On Track', lastUpdated: '2024-02-05', document: 'math_syllabus.pdf' },
  { id: 2, subjectId: 2, subjectName: 'Science', classId: 10, className: 'Class 10', term: 'Term 1', totalTopics: 18, completedTopics: 18, status: 'Completed', lastUpdated: '2024-02-03', document: 'science_syllabus.pdf' },
  { id: 3, subjectId: 3, subjectName: 'English', classId: 10, className: 'Class 10', term: 'Term 1', totalTopics: 12, completedTopics: 10, status: 'On Track', lastUpdated: '2024-02-04', document: 'english_syllabus.pdf' },
  { id: 4, subjectId: 4, subjectName: 'Social Science', classId: 10, className: 'Class 10', term: 'Term 1', totalTopics: 20, completedTopics: 15, status: 'Behind', lastUpdated: '2024-02-01', document: 'ss_syllabus.pdf' },
  { id: 5, subjectId: 5, subjectName: 'Hindi', classId: 10, className: 'Class 10', term: 'Term 1', totalTopics: 10, completedTopics: 9, status: 'On Track', lastUpdated: '2024-02-05' },
];

const mockClasses = [
  { id: 1, name: 'Class 1' },
  { id: 2, name: 'Class 2' },
  { id: 10, name: 'Class 10' },
];

const mockSubjects = [
  { id: 1, name: 'Mathematics' },
  { id: 2, name: 'Science' },
  { id: 3, name: 'English' },
  { id: 4, name: 'Social Science' },
  { id: 5, name: 'Hindi' },
];

const terms = ['Term 1', 'Term 2', 'Term 3'];

export const SyllabusManagementPage = () => {
  const navigate = useNavigate();
  const [syllabusItems, setSyllabusItems] = useState(mockSyllabus);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<SyllabusItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState('all');

  const calculateStatus = (completed: number, total: number): 'On Track' | 'Behind' | 'Completed' => {
    const percentage = (completed / total) * 100;
    if (percentage === 100) return 'Completed';
    if (percentage >= 70) return 'On Track';
    return 'Behind';
  };

  const handleOpenModal = (item: SyllabusItem | null = null) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingItem(null);
    setIsModalOpen(false);
  };

  const handleSave = (data: any) => {
    const classInfo = mockClasses.find(c => c.id === data.classId);
    const subjectInfo = mockSubjects.find(s => s.id === data.subjectId);
    const status = calculateStatus(data.completedTopics, data.totalTopics);

    if (editingItem) {
      setSyllabusItems(syllabusItems.map(item =>
        item.id === editingItem.id
          ? {
            ...item,
            classId: data.classId,
            className: classInfo?.name || '',
            subjectId: data.subjectId,
            subjectName: subjectInfo?.name || '',
            term: data.term,
            totalTopics: data.totalTopics,
            completedTopics: data.completedTopics,
            status,
            lastUpdated: new Date().toISOString().split('T')[0],
            document: data.document
          }
          : item
      ));
    } else {
      const newItem: SyllabusItem = {
        id: Date.now(),
        classId: data.classId,
        className: classInfo?.name || '',
        subjectId: data.subjectId,
        subjectName: subjectInfo?.name || '',
        term: data.term,
        totalTopics: data.totalTopics,
        completedTopics: data.completedTopics,
        status,
        lastUpdated: new Date().toISOString().split('T')[0],
        document: data.document
      };
      setSyllabusItems([...syllabusItems, newItem]);
    }
    handleCloseModal();
  };

  const deleteItem = (id: number) => {
    if (confirm('Are you sure you want to delete this syllabus entry?')) {
      setSyllabusItems(syllabusItems.filter(item => item.id !== id));
    }
  };

  const filteredItems = syllabusItems.filter(item => {
    const matchesSearch = item.subjectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.className.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = filterClass === 'all' || item.classId === parseInt(filterClass);
    return matchesSearch && matchesClass;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'On Track': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Behind': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed': return <CheckCircle2 size={16} />;
      case 'On Track': return <Clock size={16} />;
      case 'Behind': return <AlertCircle size={16} />;
      default: return <Clock size={16} />;
    }
  };

  const overallProgress = syllabusItems.reduce((acc, item) => acc + (item.completedTopics / item.totalTopics) * 100, 0) / syllabusItems.length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/academics/overview')}
            className="p-2 bg-white/40 hover:bg-white/60 rounded-full transition-colors text-gray-600 shadow-sm border border-white/20"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Syllabus Management</h1>
            <p className="text-sm text-gray-500 mt-1">Track curriculum progress and syllabus completion</p>
          </div>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2"
        >
          <Plus size={18} />
          Add Syllabus
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white/40 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
              <BookMarked size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Subjects</p>
              <p className="text-2xl font-bold text-gray-800">{syllabusItems.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white/40 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Completed</p>
              <p className="text-2xl font-bold text-gray-800">{syllabusItems.filter(s => s.status === 'Completed').length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white/40 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <Clock size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">On Track</p>
              <p className="text-2xl font-bold text-gray-800">{syllabusItems.filter(s => s.status === 'On Track').length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white/40 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
              <FileText size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Overall Progress</p>
              <p className="text-2xl font-bold text-gray-800">{Math.round(overallProgress)}%</p>
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
            placeholder="Search by subject or class..."
            className="w-full pl-12 pr-4 py-3 bg-white/50 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
        <div className="relative">
          <select
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value)}
            className="appearance-none pl-4 pr-10 py-3 bg-white/50 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-gray-700 font-medium min-w-[200px]"
          >
            <option value="all">All Classes</option>
            {mockClasses.map(cls => (
              <option key={cls.id} value={cls.id}>{cls.name}</option>
            ))}
          </select>
          <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => {
          const progressPercentage = (item.completedTopics / item.totalTopics) * 100;

          return (
            <div
              key={item.id}
              className="bg-white/40 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg hover:bg-white/60 transition-all group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/20">
                    <BookMarked size={28} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">{item.subjectName}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{item.className}</span>
                      <span className="text-gray-300">•</span>
                      <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">{item.term}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleOpenModal(item)}
                    className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-white rounded-lg transition-colors"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => deleteItem(item.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-white rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border-2 flex items-center gap-1.5 ${getStatusColor(item.status)}`}>
                        {getStatusIcon(item.status)}
                        {item.status}
                      </span>
                    </div>
                    <span className="text-sm font-bold text-gray-800">
                      {item.completedTopics} / {item.totalTopics} Topics
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`h-full transition-all rounded-full ${progressPercentage === 100 ? 'bg-emerald-500' :
                          progressPercentage >= 70 ? 'bg-blue-500' : 'bg-red-500'
                        }`}
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Progress Level</p>
                    <p className="text-xs font-bold text-gray-700">{Math.round(progressPercentage)}% Complete</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Last Updated: {new Date(item.lastUpdated).toLocaleDateString()}
                  </span>
                  {item.document && (
                    <button className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors">
                      <Download size={14} />
                      PDF
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <SyllabusManagementModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
        editingItem={editingItem}
        classes={mockClasses}
        subjects={mockSubjects}
        terms={terms}
      />
    </div>
  );
};
