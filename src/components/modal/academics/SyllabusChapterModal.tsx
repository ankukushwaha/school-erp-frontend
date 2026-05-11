import React, { useEffect, useState } from 'react';
import {
  X,
  Save,
  Layers
} from 'lucide-react';
import { CommonSearchTextbox } from '@/components/common/CommonSearchTextbox';
import { COMMON_SEARCH_CONFIGS } from '@/app/constants/commonSearchConfigs';
import type { CommonSearchItem } from '@/services/commonSearch';
import type { SyllabusChapterItem } from '@/services/syllabusChapter';

interface SyllabusChapterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (chapterData: any) => void;
  editingItem: SyllabusChapterItem | null;
}

export const SyllabusChapterModal: React.FC<SyllabusChapterModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingItem
}) => {
  const [selectedSyllabusId, setSelectedSyllabusId] = useState('');
  const [syllabusName, setSyllabusName] = useState('');
  const [chapterName, setChapterName] = useState('');
  const [chapterOrder, setChapterOrder] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (editingItem) {
      setSelectedSyllabusId(editingItem.syllabusId?.toString() || '');
      setSyllabusName(editingItem.syllabusName || '');
      setChapterName(editingItem.chapterName || '');
      setChapterOrder(editingItem.chapterOrder?.toString() || '');
      setIsCompleted(editingItem.isCompleted || false);
    } else {
      setSelectedSyllabusId('');
      setSyllabusName('');
      setChapterName('');
      setChapterOrder('');
      setIsCompleted(false);
    }
  }, [editingItem, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      syllabusId: parseInt(selectedSyllabusId),
      chapterName,
      chapterOrder: parseInt(chapterOrder),
      isCompleted
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full lg:w-[480px] bg-white rounded-3xl border border-white/20 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
              <Layers size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">
                {editingItem ? 'Edit Chapter' : 'Add New Chapter'}
              </h3>
              <p className="text-xs text-gray-500">Map chapters to syllabus</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Select Syllabus <span className="text-red-500">*</span>
            </label>
            <CommonSearchTextbox
              searchConfig={COMMON_SEARCH_CONFIGS.syllabusName}
              value={syllabusName}
              onChange={(val) => {
                setSyllabusName(val);
                if (!val) setSelectedSyllabusId('');
              }}
              onSelect={(item: CommonSearchItem) => {
                setSelectedSyllabusId(item.id.toString());
                setSyllabusName(item.label);
              }}
              placeholder="Search syllabus..."
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Chapter Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={chapterName}
              onChange={(e) => setChapterName(e.target.value)}
              placeholder="Introduction to Algebra"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-gray-700 transition-all"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Chapter Order <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={chapterOrder}
                onChange={(e) => setChapterOrder(e.target.value)}
                placeholder="1"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-gray-700 transition-all"
                required
              />
            </div>
            <div className="flex items-end pb-3">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={isCompleted}
                    onChange={(e) => setIsCompleted(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </div>
                <span className="text-sm font-medium text-gray-700 group-hover:text-indigo-600 transition-colors">Completed</span>
              </label>
            </div>
          </div>

          <div className="pt-4 flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-white border border-gray-200 rounded-2xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all active:scale-95"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-sm font-bold shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <Save size={18} />
              {editingItem ? 'Update Changes' : 'Create Chapter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
