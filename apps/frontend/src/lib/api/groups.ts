import { api } from '@/lib/apis';

export interface Group {
  id: string;
  name: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  _count: {
    notes: number;
  };
}

export interface CreateGroupDto {
  name: string;
}

export interface UpdateGroupDto {
  name?: string;
}

export const groupsApi = {
  getAll: async (): Promise<Group[]> => {
    const response = await api.get('/groups');
    return response.data;
  },

  getOne: async (id: string): Promise<Group> => {
    const response = await api.get(`/groups/${id}`);
    return response.data;
  },

  create: async (data: CreateGroupDto): Promise<Group> => {
    const response = await api.post('/groups', data);
    return response.data;
  },

  update: async (id: string, data: UpdateGroupDto): Promise<Group> => {
    const response = await api.patch(`/groups/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/groups/${id}`);
  },
};
