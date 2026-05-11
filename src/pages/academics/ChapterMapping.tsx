import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { 
  getSyllabusChapterList, 
  createSyllabusChapter, 
  updateSyllabusChapter, 
  deleteSyllabusChapter, 
  type SyllabusChapterItem 
} from '@/services/syllabusChapter';
import {
  ArrowLeft,
  Layers,
  Plus,
  Edit2,
  Trash2,
  Search,
  CheckCircle2,
  Clock,
  ChevronRight,
} from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { SyllabusChapterModal } from '@/components/modal/academics/SyllabusChapterModal';
import { ConfirmActionModal } from '@/components/modal/academics/ConfirmActionModal';
import { CommonSearchTextbox } from '@/components/common/CommonSearchTextbox';
import { COMMON_SEARCH_CONFIGS } from '@/app/constants/commonSearchConfigs';
import type { CommonSearchItem } from '@/services/commonSearch';

export const ChapterMapping = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialSyllabusId = searchParams.get('syllabusId') || 'all';

  const [chapters, setChapters] = useState<SyllabusChapterItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<SyllabusChapterItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);
  const [filterSyllabusId, setFilterSyllabusId] = useState<string>(initialSyllabusId);
  const [filterSyllabusName, setFilterSyllabusName] = useState<string>('');

  useEffect(() => {
    fetchChapters();
  }, [filterSyllabusId]);

  const fetchChapters = async () => {
    setIsLoading(true);
    try {
      const syllabusId = filterSyllabusId === 'all' ? undefined : parseInt(filterSyllabusId);
      const data = await getSyllabusChapterList(syllabusId);
      setChapters(data);
    } catch (error) {
      toast.error('Failed to load chapters');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (item: SyllabusChapterItem | null = null) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingItem(null);
    setIsModalOpen(false);
  };

  const handleSave = async (data: Partial<SyllabusChapterItem>) => {
    try {
      if (editingItem) {
        await updateSyllabusChapter(editingItem.syllabusChapterId, data);
        toast.success('Chapter updated successfully');
      } else {
        await createSyllabusChapter(data);
        toast.success('Chapter created successfully');
      }
      fetchChapters();
      handleCloseModal();
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to save chapter';
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
      await deleteSyllabusChapter(itemToDelete);
      toast.success('Chapter deleted successfully');
      fetchChapters();
    } catch (error) {
      toast.error('Failed to delete chapter');
    } finally {
      setDeleteModalOpen(false);
      setItemToDelete(null);
    }
  };

  const filteredChapters = chapters.filter(chapter => {
    const matchesSearch = chapter.chapterName.toLowerCase().includes(searchTerm.toLowerCase());
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
            <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Chapter Mapping</h1>
            <p className="text-sm text-gray-500 mt-1">Manage and organize chapters for each syllabus</p>
          </div>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2"
        >
          <Plus size={18} />
          Add Chapter
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/40 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
              <Layers size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Chapters</p>
              <p className="text-2xl font-bold text-gray-800">{chapters.length}</p>
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
              <p className="text-2xl font-bold text-gray-800">{chapters.filter(c => c.isCompleted).length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white/40 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <Clock size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-2xl font-bold text-gray-800">{chapters.filter(c => !c.isCompleted).length}</p>
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
            placeholder="Search by chapter name..."
            className="w-full pl-12 pr-4 py-3 bg-white/50 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
        <div className="w-[280px]">
          <CommonSearchTextbox
            searchConfig={COMMON_SEARCH_CONFIGS.syllabusName}
            value={filterSyllabusName}
            onChange={(val) => {
              setFilterSyllabusName(val);
              if (!val) setFilterSyllabusId('all');
            }}
            onSelect={(item: CommonSearchItem) => {
              setFilterSyllabusId(item.id.toString());
              setFilterSyllabusName(item.label);
            }}
            placeholder="Filter by syllabus..."
          />
        </div>
      </div>

      {/* Table/List */}
      <div className="bg-white/40 backdrop-blur-xl rounded-3xl border border-white/20 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-100/50 bg-gray-50/30">
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Order</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Chapter Name</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Syllabus</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100/50">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-8 h-8 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin" />
                      <p className="font-medium">Loading chapters...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredChapters.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center gap-3 opacity-60">
                      <Layers size={48} className="text-gray-300" />
                      <p className="text-lg font-semibold">No chapters found</p>
                      <p className="text-sm">Try adjusting your filters or add a new chapter</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredChapters.map((chapter) => (
                  <tr key={chapter.syllabusChapterId} className="hover:bg-white/40 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="w-8 h-8 rounded-lg bg-gray-100 text-gray-600 flex items-center justify-center font-bold text-sm">
                        {chapter.chapterOrder}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <ChevronRight size={18} />
                        </div>
                        <span className="font-bold text-gray-800">{chapter.chapterName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {chapter.syllabusName || `Syllabus #${chapter.syllabusId}`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {chapter.isCompleted ? (
                        <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold border border-emerald-200 flex items-center gap-1.5 w-fit">
                          <CheckCircle2 size={14} />
                          Completed
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold border border-amber-200 flex items-center gap-1.5 w-fit">
                          <Clock size={14} />
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleOpenModal(chapter)}
                          className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-white rounded-lg transition-all"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => confirmDelete(chapter.syllabusChapterId)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-white rounded-lg transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <SyllabusChapterModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
        editingItem={editingItem}
      />

      <ConfirmActionModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        title="Delete Chapter"
        description="Are you sure you want to delete this chapter? This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};
