import { ref, reactive } from 'vue';
import { v4 as uuidv4 } from 'uuid';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import type { DeviceFormData } from '../types/device';
import { QrApi } from '../api/qrcode';
import { useRoute } from 'vue-router'
import { onMounted } from 'vue'


export function useQrGenerator() {

  const deviceTypes = ref<string[]>([]); const isAddingNewDevice = ref(false);
  const newDeviceType = ref('');
  const qrDataString = ref('');
  const route = useRoute();
  const editingId = ref<number | null>(null);

  const formData = reactive<DeviceFormData>({
    deviceType: '',
    status: 'Исправно',
    serialNumber: '',
    deliveryDate: new Date().toISOString().substring(0, 10)
  });

  const toggleNewDevice = () => {
    if (isAddingNewDevice.value && newDeviceType.value) {
      const trimmed = newDeviceType.value.trim();

      if (!deviceTypes.value.includes(trimmed)) {
        deviceTypes.value.push(trimmed);
      }

      formData.deviceType = trimmed;
      newDeviceType.value = '';
    }

    isAddingNewDevice.value = !isAddingNewDevice.value;
  };

  const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) return '';
    const [y, m, d] = dateStr.split('-');
    return `${d}.${m}.${y}`;
  };

  const loadDeviceTypesFromQr = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (!user.id) return;

      const { data } = await QrApi.getMyQrCodes(user.id);

      const uniqueTypes = new Set<string>();

      data.forEach((item: { qr_content: string }) => {
        try {
          const parsed = JSON.parse(item.qr_content);
          if (parsed.deviceType) {
            uniqueTypes.add(parsed.deviceType);
          }
        } catch {
          console.warn('Некорректный qr_content:', item.qr_content);
        }
      });

      deviceTypes.value = Array.from(uniqueTypes);
    } catch (e) {
      console.error('Ошибка загрузки типов устройств', e);
    }
  };


  const generateQR = async () => {
    if (!formData.serialNumber) {
      alert('Введите серийный номер');
      return;
    }

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user.id) {
      alert('Пользователь не авторизован');
      return;
    }

    // ⚡ payload без лишних полей
    const qrPayload: Record<string, string> = {
      deviceType: formData.deviceType,
      serialNumber: formData.serialNumber,
      status: formData.status,
      deliveryDate: formData.deliveryDate,
      type: formData.deviceType
    };

    // uid добавляем только при создании
    if (!editingId.value) {
      qrPayload.uid = uuidv4();
    }

    qrDataString.value = JSON.stringify(qrPayload);

    try {
      if (editingId.value) {
        // обновление существующего QR-кода
        const response = await QrApi.updateQrCode(editingId.value, qrPayload);
        console.log('Update response:', response.data);
        if (response && response.data) {
          alert('QR-код обновлён');
        } else {
          alert('Не удалось обновить QR-код');
        }
      } else {
        // создание нового QR-кода
        const response = await QrApi.createQr(JSON.stringify(qrPayload), user.id);
        console.log('Create response:', response.data);
        alert('QR-код создан');
      }
    } catch (e) {
      console.error('Ошибка сохранения QR:', e);
      alert('Ошибка сохранения QR-кода');
    }
  };

  onMounted(() => {

    void loadDeviceTypesFromQr();
    const { id, deviceType, serialNumber, status, deliveryDate } = route.query

    if (id) editingId.value = Number(id);

    if (deviceType) {
      formData.deviceType = String(deviceType);
      if (!deviceTypes.value.includes(String(deviceType))) {
        deviceTypes.value.push(String(deviceType));
      }
    }

    if (serialNumber) formData.serialNumber = String(serialNumber)
    if (status === 'Исправно' || status === 'Неисправно') {
      formData.status = status
    }
    if (deliveryDate) formData.deliveryDate = String(deliveryDate)
  })

  const saveAsPDF = async (elementId: string) => {
    const element = document.getElementById(elementId);
    if (!element) return;

    try {
      const canvas = await html2canvas(element, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = canvas.width / 2;
      const imgHeight = canvas.height / 2;

      const pdf = new jsPDF({
        orientation: imgWidth > imgHeight ? 'l' : 'p',
        unit: 'px',
        format: [imgWidth + 40, imgHeight + 40]
      });

      pdf.addImage(imgData, 'PNG', 20, 20, imgWidth, imgHeight);
      pdf.save(`qr-${formData.serialNumber}.pdf`);
    } catch (error) {
      console.error('Ошибка PDF:', error);
    }
  };

  return {
    formData,
    deviceTypes,
    isAddingNewDevice,
    newDeviceType,
    qrDataString,
    toggleNewDevice,
    formatDateDisplay,
    generateQR,
    saveAsPDF
  };
}
