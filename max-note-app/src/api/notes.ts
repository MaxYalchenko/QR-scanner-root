import { api } from 'boot/axios';

export interface Note {
  id: number;
  title: string;
  description: string;
  content: string;
}

export const NotesApi = {
  getAll() {
    return api.get<Note[]>('/post');
  },

  create(note: Omit<Note, 'id'>) {
    return api.post<Note>('/post', note);
  },

  update(note: Note) {
    return api.put<Note>('/post', note);
  },

  remove(id: number) {
    return api.delete(`/post/${id}`);
  },
};
