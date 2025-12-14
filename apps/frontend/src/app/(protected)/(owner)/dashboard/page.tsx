'use client';

import { useState } from 'react';
import { GroupsList } from '@/features/groups';
import { NotesList } from '@/features/notes';
import { CategoriesList } from '@/features/categories';
import { FolderOpen, FileText, Tag } from 'lucide-react';

type View = 'groups' | 'notes' | 'categories';

export default function DashboardPage() {
  const [activeView, setActiveView] = useState<View>('notes');
  const [selectedGroupId, setSelectedGroupId] = useState<string | undefined>();

  const handleGroupSelect = (groupId: string) => {
    setSelectedGroupId(groupId);
    setActiveView('notes');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => {
                setActiveView('notes');
                setSelectedGroupId(undefined);
              }}
              className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                activeView === 'notes'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FileText className="w-5 h-5" />
              <span>Notes</span>
            </button>

            <button
              onClick={() => {
                setActiveView('groups');
                setSelectedGroupId(undefined);
              }}
              className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                activeView === 'groups'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FolderOpen className="w-5 h-5" />
              <span>Groups</span>
            </button>

            <button
              onClick={() => {
                setActiveView('categories');
                setSelectedGroupId(undefined);
              }}
              className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                activeView === 'categories'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Tag className="w-5 h-5" />
              <span>Categories</span>
            </button>
          </nav>
        </div>

        {/* Content Area */}
        <div>
          {activeView === 'notes' && <NotesList groupId={selectedGroupId} />}
          {activeView === 'groups' && <GroupsList onGroupSelect={handleGroupSelect} />}
          {activeView === 'categories' && <CategoriesList />}
        </div>
      </div>
    </div>
  );
}
