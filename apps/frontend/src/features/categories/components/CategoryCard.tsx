'use client';

import { useState } from 'react';
import { categoriesApi, type Category } from '@/lib/api';
import { Trash2, Edit2, Tag } from 'lucide-react';

interface CategoryCardProps {
  category: Category;
  onEdit: () => void;
  onDelete: () => void;
}

export function CategoryCard({ category, onEdit, onDelete }: CategoryCardProps) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm(`Delete category "${category.name}"?`)) {
      return;
    }

    setDeleting(true);
    try {
      await categoriesApi.delete(category.id);
      onDelete();
    } catch (err) {
      alert('Failed to delete category');
      setDeleting(false);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit();
  };

  return (
    <div
      className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
      style={{ borderLeftWidth: '4px', borderLeftColor: category.color || '#3B82F6' }}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3 flex-1">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ backgroundColor: category.color + '20' || '#3B82F620' }}
          >
            <Tag className="w-5 h-5" style={{ color: category.color || '#3B82F6' }} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
            <p className="text-sm text-gray-500">
              {category._count.notes} {category._count.notes === 1 ? 'note' : 'notes'}
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
