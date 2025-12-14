import { api } from '@/lib/apis';

export enum NoteStatus {
  ACTIVE = 'ACTIVE',
  ARCHIVED = 'ARCHIVED',
  TRASHED = 'TRASHED',
}

interface Category {
  id: string;
  name: string;
  color?: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  status: NoteStatus;
  groupId: string;
  createdAt: string;
  updatedAt: string;
  categories: {
    category: Category;
  }[];
  group: {
    id: string;
    name: string;
  };
}

export interface CreateNoteDto {
  title: string;
  content: string;
  groupId: string;
  categoryIds?: string[];
}

export interface UpdateNoteDto {
  title?: string;
  content?: string;
  status?: NoteStatus;
  categoryIds?: string[];
}

export interface FilterNotesDto {
  status?: NoteStatus;
  categoryId?: string;
  groupId?: string;
}

export const notesApi = {
  getAll: async (filters?: FilterNotesDto): Promise<Note[]> => {
    const response = await api.get('/notes', { params: filters });
    return response.data;
  },

  getOne: async (id: string): Promise<Note> => {
    const response = await api.get(`/notes/${id}`);
    return response.data;
  },

  create: async (data: CreateNoteDto): Promise<Note> => {
    const response = await api.post('/notes', data);
    return response.data;
  },

  update: async (id: string, data: UpdateNoteDto): Promise<Note> => {
    const response = await api.patch(`/notes/${id}`, data);
    return response.data;
  },

  archive: async (id: string): Promise<Note> => {
    const response = await api.patch(`/notes/${id}/archive`);
    return response.data;
  },

  unarchive: async (id: string): Promise<Note> => {
    const response = await api.patch(`/notes/${id}/unarchive`);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/notes/${id}`);
  },
};
