'use client';

import { useEffect, useState } from 'react';
import { groupsApi, type Group } from '@/lib/api';
import { GroupCard } from './GroupCard';
import { GroupForm } from './GroupForm';
import { Plus, X } from 'lucide-react';

interface GroupsListProps {
  onGroupSelect?: (groupId: string) => void;
}

export function GroupsList({ onGroupSelect }: GroupsListProps) {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);

  const loadGroups = async () => {
    try {
      const data = await groupsApi.getAll();
      setGroups(data);
    } catch (err) {
      console.error('Failed to load groups:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGroups();
  }, []);

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingGroup(null);
    loadGroups();
  };

  const handleEdit = (group: Group) => {
    setEditingGroup(group);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingGroup(null);
  };

  if (loading) {
    return <div className="text-center py-12">Loading groups...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">My Groups</h2>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            <span>New Group</span>
          </button>
        )}
      </div>

      {showForm && (
        <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">
              {editingGroup ? 'Edit Group' : 'Create New Group'}
            </h3>
            <button
              onClick={handleCancel}
              className="p-1 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <GroupForm
            group={editingGroup || undefined}
            onSuccess={handleFormSuccess}
            onCancel={handleCancel}
          />
        </div>
      )}

      {groups.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>No groups yet. Create your first group to get started!</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {groups.map((group) => (
            <GroupCard
              key={group.id}
              group={group}
              onEdit={() => handleEdit(group)}
              onDelete={loadGroups}
              onClick={() => onGroupSelect?.(group.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
