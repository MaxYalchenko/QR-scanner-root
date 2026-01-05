import { api } from 'boot/axios';

export const QrApi = {
  createQr(qr_content: string, user_id: number) {
    return api.post('/qrcodes', {
      qr_content,
      user_id
    });
  },

  getMyQrCodes(user_id: number) {
    return api.get('/qrcodes', {
      params: { user_id }
    });
  },

  updateQrCode(
    id: number,
    data: { deviceType?: string; serialNumber?: string; status?: string; deliveryDate?: string }
  ) {
    return api.put(`/qrcodes/${id}`, data);
  },


  deleteQrСode(id: number) {
    return api.delete(`/qrcodes/${id}`)
  }


};
