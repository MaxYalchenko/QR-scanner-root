import { api } from 'boot/axios';

export const HistoryApi = {
  addScanHistory(data: {
    user_id: number;
    qr_code_id?: number | null;
    qr_content: string;
  }) {
    return api.post('/history', data);
  },

  getMyScanHistory(user_id: number) {
    return api.get('/history', {
      params: { user_id }
    });
  },

  deleteMyHistory(id: number) {
    return api.delete(`/history/${id}`);
  }

};
