'use client';

import { useState } from 'react';
import { notesApi, type Note } from '@/lib/api';
import { Trash2, Edit2, Archive, ArchiveRestore } from 'lucide-react';

interface NoteCardProps {
  note: Note;
  onEdit: () => void;
  onChange: () => void;
}

export function NoteCard({ note, onEdit, onChange }: NoteCardProps) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm(`Delete note "${note.title}"?`)) {
      return;
    }

    setLoading(true);
    try {
      await notesApi.delete(note.id);
      onChange();
    } catch (err) {
      alert('Failed to delete note');
      setLoading(false);
    }
  };

  const handleArchive = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setLoading(true);
    try {
      if (note.status === 'ARCHIVED') {
        await notesApi.unarchive(note.id);
      } else {
        await notesApi.archive(note.id);
      }
      onChange();
    } catch (err) {
      alert('Failed to update note');
      setLoading(false);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit();
  };

  return (
    <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-lg font-semibold text-gray-900 flex-1">{note.title}</h3>
        <div className="flex space-x-1">
          <button
            onClick={handleEdit}
            className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded"
            disabled={loading}
            title="Edit"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={handleArchive}
            className="p-1.5 text-gray-600 hover:text-yellow-600 hover:bg-yellow-50 rounded"
            disabled={loading}
            title={note.status === 'ARCHIVED' ? 'Unarchive' : 'Archive'}
          >
            {note.status === 'ARCHIVED' ? (
              <ArchiveRestore className="w-4 h-4" />
            ) : (
              <Archive className="w-4 h-4" />
            )}
          </button>
          <button
            onClick={handleDelete}
            className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded"
            disabled={loading}
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-3 line-clamp-3">{note.content}</p>

      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-1">
          {note.categories.map(({ category }) => (
            <span
              key={category.id}
              className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-700"
              style={
                category.color
                  ? { backgroundColor: category.color + '20', color: category.color }
                  : {}
              }
            >
              {category.name}
            </span>
          ))}
        </div>
        <span className="text-xs text-gray-500">{note.group.name}</span>
      </div>

      {note.status === 'ARCHIVED' && (
        <div className="mt-2 pt-2 border-t border-gray-200">
          <span className="text-xs text-yellow-600 font-medium">Archived</span>
        </div>
      )}
    </div>
  );
}
