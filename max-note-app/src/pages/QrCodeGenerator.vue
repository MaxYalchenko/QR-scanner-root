<template>
  <div class="qr-generator-container">
    <h2>Генератор QR-кодов оборудования</h2>

    <div class="form-section">
      <div class="input-group">
        <label>Тип устройства:</label>

        <div class="flex-row">
        <select v-model="formData.deviceType" v-if="!isAddingNewDevice">
          <option disabled value="">Выберите устройство</option>
          <option v-for="type in deviceTypes" :key="type" :value="type">{{ type }}</option>
        </select>

        <input v-else v-model="newDeviceType" placeholder="Новое устройство" />

        <button @click="toggleNewDevice">
          {{ isAddingNewDevice ? 'Добавить' : '+' }}
        </button>
        </div>
      </div>

      <div class="input-group">
        <label>Статус:</label>
        <select v-model="formData.status">
          <option value="Исправно">Исправно</option>
          <option value="Неисправно">Неисправно</option>
        </select>
      </div>

      <div class="input-group">
        <label>Серийный номер:</label>
        <input v-model="formData.serialNumber" placeholder="Например: 00010186" />
      </div>

      <div class="input-group">
        <label>Дата поставки:</label>
        <input type="date" v-model="formData.deliveryDate" />
      </div>

      <button class="generate-btn" @click="generateQR">Сгенерировать</button>
    </div>

    <hr v-if="qrDataString" />

    <div v-if="qrDataString" class="result-area">
      <div id="qr-to-print" class="qr-result-card">
        <div class="label-text">
          <div class="serial">{{ formData.serialNumber }}</div>
          <div class="date">{{ formatDateDisplay(formData.deliveryDate) }}</div>
        </div>

        <div class="qr-wrapper">
          <qrcode-vue
            :value="qrDataString"
            :size="150"
            level="H"
            render-as="svg"
          />
        </div>

        <div class="status-badge" :class="formData.status === 'Исправно' ? 'ok' : 'fail'">
          {{ formData.status }}
        </div>
      </div>

      <div class="actions">
        <button class="save-pdf-btn" @click="saveAsPDF('qr-to-print')">
          Сохранить PDF
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import QrcodeVue from 'qrcode.vue';
import { useQrGenerator } from '../composables/useQrGenerator';

const {
  formData,
  deviceTypes,
  isAddingNewDevice,
  newDeviceType,
  qrDataString,
  toggleNewDevice,
  formatDateDisplay,
  generateQR,
  saveAsPDF
} = useQrGenerator();
</script>

<style lang="scss" scoped>
@import "../css/qrCodeGeneratorStyle.scss";
</style>
