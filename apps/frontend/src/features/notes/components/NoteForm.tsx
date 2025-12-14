'use client';

import { useState, useEffect } from 'react';
import { notesApi, categoriesApi, groupsApi, type CreateNoteDto, type UpdateNoteDto, type Note, type Category, type Group } from '@/lib/api';

interface NoteFormProps {
  note?: Note;
  defaultGroupId?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function NoteForm({ note, defaultGroupId, onSuccess, onCancel }: NoteFormProps) {
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [groupId, setGroupId] = useState(note?.groupId || defaultGroupId || '');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    note?.categories.map(c => c.category.id) || []
  );
  const [groups, setGroups] = useState<Group[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [groupsData, categoriesData] = await Promise.all([
          groupsApi.getAll(),
          categoriesApi.getAll(),
        ]);
        setGroups(groupsData);
        setCategories(categoriesData);
      } catch (err) {
        console.error('Failed to load data:', err);
      }
    };
    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (note) {
        const updateData: UpdateNoteDto = {
          title,
          content,
          categoryIds: selectedCategories,
        };
        await notesApi.update(note.id, updateData);
      } else {
        const createData: CreateNoteDto = {
          title,
          content,
          groupId,
          categoryIds: selectedCategories,
        };
        await notesApi.create(createData);
      }
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
          maxLength={200}
          disabled={loading}
        />
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700">
          Content
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={6}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
          disabled={loading}
        />
      </div>

      {!note && (
        <div>
          <label htmlFor="group" className="block text-sm font-medium text-gray-700">
            Group
          </label>
          <select
            id="group"
            value={groupId}
            onChange={(e) => setGroupId(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
            disabled={loading}
          >
            <option value="">Select a group</option>
            {groups.map((group) => (
              <option key={group.id} value={group.id}>
                {group.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Categories
        </label>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => toggleCategory(category.id)}
              className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                selectedCategories.includes(category.id)
                  ? 'bg-blue-100 border-blue-500 text-blue-700'
                  : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
              }`}
              disabled={loading}
              style={
                selectedCategories.includes(category.id) && category.color
                  ? { backgroundColor: category.color + '20', borderColor: category.color }
                  : {}
              }
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Saving...' : note ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  );
}
