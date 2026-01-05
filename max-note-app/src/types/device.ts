export interface DeviceFormData {
  deviceType: string;
  status: 'Исправно' | 'Неисправно';
  serialNumber: string;
  deliveryDate: string;
}
