import React, { useEffect, useState } from 'react';
import {
  X,
  Save,
  Target
} from 'lucide-react';
import { CommonSearchTextbox } from '@/components/common/CommonSearchTextbox';
import { COMMON_SEARCH_CONFIGS } from '@/app/constants/commonSearchConfigs';
import type { CommonSearchItem } from '@/services/commonSearch';
import type { SyllabusTopicItem } from '@/services/syllabusTopic';

interface SyllabusTopicModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (topicData: any) => void;
  editingItem: SyllabusTopicItem | null;
}

export const SyllabusTopicModal: React.FC<SyllabusTopicModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingItem
}) => {
  const [selectedChapterId, setSelectedChapterId] = useState('');
  const [chapterName, setChapterName] = useState('');
  const [topicName, setTopicName] = useState('');
  const [topicContent, setTopicContent] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (editingItem) {
      setSelectedChapterId(editingItem.syllabusChapterId?.toString() || '');
      setChapterName(editingItem.chapterName || '');
      setTopicName(editingItem.topicName || '');
      setTopicContent(editingItem.topicContent || '');
      setIsCompleted(editingItem.isCompleted || false);
    } else {
      setSelectedChapterId('');
      setChapterName('');
      setTopicName('');
      setTopicContent('');
      setIsCompleted(false);
    }
  }, [editingItem, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      syllabusChapterId: parseInt(selectedChapterId),
      topicName,
      topicContent,
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
              <Target size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">
                {editingItem ? 'Edit Topic' : 'Add New Topic'}
              </h3>
              <p className="text-xs text-gray-500">Map topics to chapters</p>
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
              Select Chapter <span className="text-red-500">*</span>
            </label>
            <CommonSearchTextbox
              searchConfig={COMMON_SEARCH_CONFIGS.chapterName}
              value={chapterName}
              onChange={(val) => {
                setChapterName(val);
                if (!val) setSelectedChapterId('');
              }}
              onSelect={(item: CommonSearchItem) => {
                setSelectedChapterId(item.id.toString());
                setChapterName(item.label);
              }}
              placeholder="Search chapter..."
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Topic Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={topicName}
              onChange={(e) => setTopicName(e.target.value)}
              placeholder="Introduction to Variables"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-gray-700 transition-all"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Topic Content
            </label>
            <textarea
              value={topicContent}
              onChange={(e) => setTopicContent(e.target.value)}
              placeholder="Summary or objectives of the topic..."
              rows={3}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-gray-700 transition-all resize-none"
            />
          </div>

          <div className="flex items-center pb-3">
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
              <span className="text-sm font-medium text-gray-700 group-hover:text-indigo-600 transition-colors">Mark as Completed</span>
            </label>
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
              {editingItem ? 'Update Changes' : 'Create Topic'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
