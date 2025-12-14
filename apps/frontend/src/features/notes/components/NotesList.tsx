'use client';

import { useEffect, useState } from 'react';
import { notesApi, categoriesApi, type Note, type Category, NoteStatus } from '@/lib/api';
import { NoteCard } from './NoteCard';
import { NoteForm } from './NoteForm';
import { Plus, X, Filter } from 'lucide-react';

interface NotesListProps {
  groupId?: string;
}

export function NotesList({ groupId }: NotesListProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [filterStatus, setFilterStatus] = useState<NoteStatus | 'ALL'>('ALL');
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);

  const loadNotes = async () => {
    try {
      const filters: any = {};
      
      if (filterStatus !== 'ALL') {
        filters.status = filterStatus;
      }
      
      if (filterCategory) {
        filters.categoryId = filterCategory;
      }
      
      if (groupId) {
        filters.groupId = groupId;
      }

      const data = await notesApi.getAll(filters);
      setNotes(data);
    } catch (err) {
      console.error('Failed to load notes:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await categoriesApi.getAll();
      setCategories(data);
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  };

  useEffect(() => {
    loadNotes();
    loadCategories();
  }, [filterStatus, filterCategory, groupId]);

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingNote(null);
    loadNotes();
  };

  const handleEdit = (note: Note) => {
    setEditingNote(note);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingNote(null);
  };

  const activeNotes = notes.filter(n => n.status === NoteStatus.ACTIVE);
  const archivedNotes = notes.filter(n => n.status === NoteStatus.ARCHIVED);

  if (loading) {
    return <div className="text-center py-12">Loading notes...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Notes</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </button>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
              <span>New Note</span>
            </button>
          )}
        </div>
      </div>

      {showFilters && (
        <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as NoteStatus | 'ALL')}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="ALL">All Notes</option>
                <option value={NoteStatus.ACTIVE}>Active</option>
                <option value={NoteStatus.ARCHIVED}>Archived</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">
              {editingNote ? 'Edit Note' : 'Create New Note'}
            </h3>
            <button
              onClick={handleCancel}
              className="p-1 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <NoteForm
            note={editingNote || undefined}
            defaultGroupId={groupId}
            onSuccess={handleFormSuccess}
            onCancel={handleCancel}
          />
        </div>
      )}

      {filterStatus === 'ALL' || filterStatus === NoteStatus.ACTIVE ? (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Active Notes ({activeNotes.length})
          </h3>
          {activeNotes.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No active notes. Create your first note!</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {activeNotes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onEdit={() => handleEdit(note)}
                  onChange={loadNotes}
                />
              ))}
            </div>
          )}
        </div>
      ) : null}

      {filterStatus === 'ALL' || filterStatus === NoteStatus.ARCHIVED ? (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Archived Notes ({archivedNotes.length})
          </h3>
          {archivedNotes.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No archived notes.</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {archivedNotes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onEdit={() => handleEdit(note)}
                  onChange={loadNotes}
                />
              ))}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
