'use client';

import { useState } from 'react';
import { groupsApi, type Group } from '@/lib/api';
import { Trash2, Edit2, FolderOpen } from 'lucide-react';

interface GroupCardProps {
  group: Group;
  onEdit: () => void;
  onDelete: () => void;
  onClick: () => void;
}

export function GroupCard({ group, onEdit, onDelete, onClick }: GroupCardProps) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm(`Delete group "${group.name}"? This will also delete all notes in this group.`)) {
      return;
    }

    setDeleting(true);
    try {
      await groupsApi.delete(group.id);
      onDelete();
    } catch (err) {
      alert('Failed to delete group');
      setDeleting(false);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit();
  };

  return (
    <div
      onClick={onClick}
      className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3 flex-1">
          <FolderOpen className="w-6 h-6 text-blue-500" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{group.name}</h3>
            <p className="text-sm text-gray-500">
              {group._count.notes} {group._count.notes === 1 ? 'note' : 'notes'}
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleEdit}
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded"
            disabled={deleting}
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded"
            disabled={deleting}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
