import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { getSyllabusList, createSyllabus, updateSyllabus, deleteSyllabus, type SyllabusItem } from '@/services/syllabus';
import {
  ArrowLeft,
  BookMarked,
  Plus,
  Edit2,
  Trash2,
  FileText,
  Search,
  Download,
  CheckCircle2,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SyllabusManagementModal } from '@/components/modal/academics/SyllabusManagementModal';
import { ConfirmActionModal } from '@/components/modal/academics/ConfirmActionModal';
import { CommonSearchTextbox } from '@/components/common/CommonSearchTextbox';
import { COMMON_SEARCH_CONFIGS } from '@/app/constants/commonSearchConfigs';
import type { CommonSearchItem } from '@/services/commonSearch';

// Mock data removed. Using real services for classes and subjects.

export const SyllabusManagementPage = () => {
  const navigate = useNavigate();
  const [syllabusItems, setSyllabusItems] = useState<SyllabusItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<SyllabusItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);
  const [filterClassId, setFilterClassId] = useState<string>('all');
  const [filterClassName, setFilterClassName] = useState<string>('');

  useEffect(() => {
    fetchSyllabus();
  }, [filterClassId]);

  const calculateStatus = (completed: number, total: number): 'On Track' | 'Behind' | 'Completed' => {
    if (!total) return 'Behind';
    const percentage = (completed / total) * 100;
    if (percentage === 100) return 'Completed';
    if (percentage >= 70) return 'On Track';
    return 'Behind';
  };

  const fetchSyllabus = async () => {
    setIsLoading(true);
    try {
      const classId = filterClassId === 'all' ? undefined : parseInt(filterClassId);
      const data = await getSyllabusList(classId);
      setSyllabusItems(data);
    } catch (error) {
      toast.error('Failed to load syllabus items');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (item: SyllabusItem | null = null) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingItem(null);
    setIsModalOpen(false);
  };

  const handleSave = async (data: Partial<SyllabusItem>) => {
    const status = calculateStatus(data.completedTopics || 0, data.totalTopics || 0);

    try {
      if (editingItem) {
        await updateSyllabus(editingItem.id, {
          ...data,
          status,
        });
        toast.success('Syllabus updated successfully');
      } else {
        await createSyllabus({
          ...data,
          status,
        });
        toast.success('Syllabus created successfully');
      }
      fetchSyllabus();
      handleCloseModal();
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to save syllabus';
      toast.error(message);
    }
  };

  const confirmDelete = (id: number) => {
    setItemToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      await deleteSyllabus(itemToDelete);
      toast.success('Syllabus deleted successfully');
      fetchSyllabus();
    } catch (error) {
      toast.error('Failed to delete syllabus');
    } finally {
      setDeleteModalOpen(false);
      setItemToDelete(null);
    }
  };

  const filteredItems = syllabusItems.filter(item => {
    const matchesSearch = item.subjectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.className.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
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
        <div className="w-[240px]">
          <CommonSearchTextbox
            searchConfig={COMMON_SEARCH_CONFIGS.className}
            value={filterClassName}
            onChange={(val) => {
              setFilterClassName(val);
              if (!val) setFilterClassId('all');
            }}
            onSelect={(item: CommonSearchItem) => {
              setFilterClassId(item.id.toString());
              setFilterClassName(item.label);
            }}
            placeholder="Filter by class..."
          />
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
                    onClick={() => confirmDelete(item.id)}
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
      />

      <ConfirmActionModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        title="Delete Syllabus"
        description="Are you sure you want to delete this syllabus entry? This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};
