import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import {
  getSyllabusTopicList,
  createSyllabusTopic,
  updateSyllabusTopic,
  deleteSyllabusTopic,
  type SyllabusTopicItem
} from '@/services/syllabusTopic';
import {
  ArrowLeft,
  Target,
  Plus,
  Edit2,
  Trash2,
  Search,
  CheckCircle2,
  Clock,
  FileText,
} from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { SyllabusTopicModal } from '@/components/modal/academics/SyllabusTopicModal';
import { ConfirmActionModal } from '@/components/modal/academics/ConfirmActionModal';
import { CommonSearchTextbox } from '@/components/common/CommonSearchTextbox';
import { COMMON_SEARCH_CONFIGS } from '@/app/constants/commonSearchConfigs';
import type { CommonSearchItem } from '@/services/commonSearch';

export const TopicMapping = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialChapterId = searchParams.get('chapterId') || 'all';

  const [topics, setTopics] = useState<SyllabusTopicItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<SyllabusTopicItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);
  const [filterChapterId, setFilterChapterId] = useState<string>(initialChapterId);
  const [filterChapterName, setFilterChapterName] = useState<string>('');

  useEffect(() => {
    fetchTopics();
  }, [filterChapterId]);

  const fetchTopics = async () => {
    setIsLoading(true);
    try {
      const chapterId = filterChapterId === 'all' ? undefined : parseInt(filterChapterId);
      const data = await getSyllabusTopicList(chapterId);
      setTopics(data);
    } catch (error) {
      toast.error('Failed to load topics');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (item: SyllabusTopicItem | null = null) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingItem(null);
    setIsModalOpen(false);
  };

  const handleSave = async (data: Partial<SyllabusTopicItem>) => {
    try {
      if (editingItem) {
        await updateSyllabusTopic(editingItem.topicId, data);
        toast.success('Topic updated successfully');
      } else {
        await createSyllabusTopic(data);
        toast.success('Topic created successfully');
      }
      fetchTopics();
      handleCloseModal();
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to save topic';
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
      await deleteSyllabusTopic(itemToDelete);
      toast.success('Topic deleted successfully');
      fetchTopics();
    } catch (error) {
      toast.error('Failed to delete topic');
    } finally {
      setDeleteModalOpen(false);
      setItemToDelete(null);
    }
  };

  const filteredTopics = topics.filter(topic => {
    const matchesSearch = topic.topicName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

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
            <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Topic Mapping</h1>
            <p className="text-sm text-gray-500 mt-1">Manage and track individual topics within chapters</p>
          </div>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2"
        >
          <Plus size={18} />
          Add Topic
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/40 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
              <Target size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Topics</p>
              <p className="text-2xl font-bold text-gray-800">{topics.length}</p>
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
              <p className="text-2xl font-bold text-gray-800">{topics.filter(t => t.isCompleted).length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white/40 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <Clock size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">In Progress</p>
              <p className="text-2xl font-bold text-gray-800">{topics.filter(t => !t.isCompleted).length}</p>
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
            placeholder="Search by topic name..."
            className="w-full pl-12 pr-4 py-3 bg-white/50 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
        <div className="w-[280px]">
          <CommonSearchTextbox
            searchConfig={COMMON_SEARCH_CONFIGS.chapterName}
            value={filterChapterName}
            onChange={(val) => {
              setFilterChapterName(val);
              if (!val) setFilterChapterId('all');
            }}
            onSelect={(item: CommonSearchItem) => {
              setFilterChapterId(item.id.toString());
              setFilterChapterName(item.label);
            }}
            placeholder="Filter by chapter..."
          />
        </div>
      </div>

      {/* Topics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full flex flex-col items-center py-20 text-gray-500">
            <div className="w-10 h-10 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin mb-4" />
            <p className="font-medium">Loading topics...</p>
          </div>
        ) : filteredTopics.length === 0 ? (
          <div className="col-span-full flex flex-col items-center py-20 bg-white/30 rounded-3xl border border-white/20 border-dashed">
            <Target size={48} className="text-gray-300 mb-4" />
            <p className="text-lg font-bold text-gray-400">No topics found</p>
          </div>
        ) : (
          filteredTopics.map((topic) => (
            <div
              key={topic.topicId}
              className="bg-white/40 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg hover:bg-white/60 transition-all group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg transition-colors ${topic.isCompleted ? 'bg-emerald-100 text-emerald-600 shadow-emerald-100' : 'bg-indigo-100 text-indigo-600 shadow-indigo-100'
                    }`}>
                    {topic.isCompleted ? <CheckCircle2 size={24} /> : <Target size={24} />}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 group-hover:text-indigo-600 transition-colors line-clamp-1">{topic.topicName}</h3>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-0.5">{topic.chapterName || `Chapter #${topic.syllabusChapterId}`}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleOpenModal(topic)}
                    className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-white rounded-lg transition-colors"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => confirmDelete(topic.topicId)}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-white rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {topic.topicContent && (
                <div className="mb-4 bg-gray-50/50 rounded-xl p-3 border border-gray-100/50">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                    <FileText size={12} />
                    Overview
                  </div>
                  <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">
                    {topic.topicContent}
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-gray-100/50">
                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border flex items-center gap-1.5 uppercase tracking-wider ${topic.isCompleted ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                  }`}>
                  {topic.isCompleted ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                  {topic.isCompleted ? 'Completed' : 'Pending'}
                </span>
                {topic.completedDate && topic.isCompleted && (
                  <span className="text-[10px] font-bold text-gray-400">
                    {new Date(topic.completedDate).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <SyllabusTopicModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
        editingItem={editingItem}
      />

      <ConfirmActionModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        title="Delete Topic"
        description="Are you sure you want to delete this topic? This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};
