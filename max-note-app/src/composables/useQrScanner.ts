import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { QrApi } from '../api/qrcode'
import { useRouter } from 'vue-router'
import { HistoryApi } from '../api/history'


interface DetectedCode {
  rawValue: string
}

interface StoredQr {
  id: number
  qr_content: string
}

interface UserQr {
  id: number
  deviceType: string
  serialNumber: string
  status: boolean
  deliveryDate: string
}

interface ScanHistory {
  id: number;
  qr_content: string;
  scanned_at: string;
}


export function useQrScanner() {
  const $q = useQuasar()
  const router = useRouter()
  const result = ref<string>('')
  const loading = ref<boolean>(true)
  const showCheck = ref<boolean>(false)

  const scanHistory = ref<ScanHistory[]>([])

  const showHistory = ref<boolean>(false)

  const myQrCodes = ref<UserQr[]>([])

  const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3')

  const playSound = () => {
    audio.currentTime = 0
    audio.play().catch(() => { })
  }

  const onDetect = async (detectedCodes: DetectedCode[]) => {
    const firstCode = detectedCodes[0]?.rawValue;
    if (!firstCode || firstCode === result.value) return;

    result.value = firstCode;
    showCheck.value = true;
    playSound();

    if (window.navigator.vibrate) {
      window.navigator.vibrate(100);
    }

    setTimeout(() => {
      showCheck.value = false;
    }, 2000);

    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (!user.id) return;

      await HistoryApi.addScanHistory({
        user_id: user.id,
        qr_content: firstCode,
        qr_code_id: null
      });
    } catch (e) {
      console.error('Ошибка сохранения истории', e);
    }
  };

  const onCameraReady = () => {
    loading.value = false
  }

  const isLink = (str: string): boolean => {
    return str.startsWith('http://') || str.startsWith('https://')
  }

  const copyResult = async () => {
    if (!result.value) return
    await navigator.clipboard.writeText(result.value)
    $q.notify({ color: 'positive', message: 'Скопировано!', timeout: 1000 })
  }


  //загрузка QR пользователя
  const loadMyQrCodes = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      if (!user.id) return

      const { data } = await QrApi.getMyQrCodes(user.id)

      myQrCodes.value = data.map((item: StoredQr) => ({
        id: item.id,
        ...JSON.parse(item.qr_content)
      }))
    } catch (e) {
      console.error('Ошибка загрузки QR', e)
    }
  }

  const openInGenerator = (qr: UserQr) => {
    void router.push({
      path: 'qr-generator',
      query: {
        id: String(qr.id), // добавляем id
        deviceType: qr.deviceType,
        serialNumber: qr.serialNumber,
        status: String(qr.status),
        deliveryDate: qr.deliveryDate
      }
    });
  }

  const loadScanHistory = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (!user.id) return;

      const { data } = await HistoryApi.getMyScanHistory(user.id);
      scanHistory.value = data;
    } catch (e) {
      console.error('Ошибка загрузки истории', e);
    }
  };

  const toggleHistory = async () => {
    showHistory.value = !showHistory.value;
    if (showHistory.value) {
      await loadScanHistory();
    }
  };

  const deleteHistory = async (recordId: number) => {

    scanHistory.value = scanHistory.value.filter(item => item.id !== recordId);

    try {
      await HistoryApi.deleteMyHistory(recordId);
      $q.notify({ color: 'negative', message: 'Запись истории удалена', timeout: 2000 });

      scanHistory.value = scanHistory.value.filter(item => item.id !== recordId);
    } catch (e) {
      console.error('Ошибка удаления записи истории:', e);
      $q.notify({ color: 'negative', message: 'Не удалось удалить запись', timeout: 2000 });
    }
  };

  onMounted(loadMyQrCodes)

  const deleteQr = async (qr: UserQr) => {

    //Для быстрого удаления закоментил, потом уберу
    //const confirmed = window.confirm(`Удалить QR-код "${qr.deviceType} — ${qr.serialNumber}"?`);
    //if (!confirmed) return;

    try {
      await QrApi.deleteQrСode(qr.id);
      // Обновляем список после удаления
      myQrCodes.value = myQrCodes.value.filter(item => item.id !== qr.id);
      $q.notify({ color: 'negative', message: 'QR-код удалён', timeout: 2000 });
    } catch (e) {
      console.error('Ошибка удаления QR:', e);
      $q.notify({ color: 'negative', message: 'Не удалось удалить QR-код', timeout: 2000 });
    }
  };



  return {
    result,
    loading,
    showCheck,
    myQrCodes,
    scanHistory,
    showHistory,
    deleteHistory,
    onDetect,
    onCameraReady,
    isLink,
    openInGenerator,
    copyResult,
    deleteQr,
    toggleHistory
  }
}
