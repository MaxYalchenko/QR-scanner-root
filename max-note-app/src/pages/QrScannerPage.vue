<template>
  <q-page class="flex flex-center q-pa-md">
    <div class="scanner-container text-center">
      <h1 class="text-h5 q-mb-md">Сканировать QR-код</h1>

      <div class="camera-wrapper">
        <qrcode-stream
          @detect="onDetect"
          @camera-on="onCameraReady"
          class="camera-stream"
        />

        <div v-if="loading" class="overlay flex flex-center">
          <q-spinner-oval color="primary" size="50px" />
        </div>
      </div>

      <div class="result-section q-mt-lg">
        <div class="flex items-center justify-center q-gutter-sm q-mb-xs">
          <div class="text-subtitle2 color-grey">Результат:</div>

          <transition name="check-fade">
            <div v-if="showCheck" class="success-checkmark">
              <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                <circle class="checkmark__circle" cx="26" cy="26" r="25" fill="none"/>
                <path class="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
              </svg>
            </div>
          </transition>
        </div>

        <q-card flat bordered class="q-pa-sm bg-grey-2 result-box">
          <template v-if="result">
            <div v-if="isLink(result)" class="text-primary text-bold break-word">
              <a :href="result" target="_blank">{{ result }}</a>
            </div>
            <div v-else class="text-black break-word">
              {{ result }}
            </div>
          </template>
          <div v-else class="text-grey-6 italic">
            Наведите камеру на код
          </div>
        </q-card>

        <q-btn
          v-if="result"
          flat
          color="primary"
          icon="content_copy"
          label="Копировать"
          class="q-mt-sm"
          @click="copyResult"
        />

        <q-btn
          flat
          color="secondary"
          icon="history"
          label="История сканирования"
          class="q-mt-md"
          @click="toggleHistory"
          />

        <q-card v-if="showHistory" class="q-mt-md">
          <q-card-section>
            <div class="text-h6 q-mb-sm">История сканирований</div>

            <q-table
              flat
              bordered
              :rows="scanHistory"
              :columns="[
                { name: 'content', label: 'QR', field: 'qr_content', align: 'left' },
                { name: 'date', label: 'Дата', field: 'scanned_at', align: 'left' },
                { name: 'actions', label: 'Действия', field: 'actions', align: 'center' }
              ]"
              row-key="id"
            >

              <template v-slot:body-cell-date="props">
                {{ new Date(props.value).toLocaleString() }}
              </template>

              <template v-slot:body-cell-actions="props">
                <q-btn
                  flat
                  color="negative"
                  icon="delete"
                  label="Удалить"
                  size="sm"
                  @click.stop="deleteHistory(props.row.id)"
                />
              </template>
            </q-table>
          </q-card-section>
    </q-card>

      </div>

      <div v-if="myQrCodes.length" class="q-mt-xl">
      <div class="text-h6 q-mb-sm">Мои QR-коды</div>


      <q-list bordered separator>

        <q-item
          v-for="qr in myQrCodes" :key="qr.id">
          <q-item-section>
            <q-item-label>
              {{ qr.deviceType }} — {{ qr.serialNumber }}
            </q-item-label>
            <q-item-label caption>
              Статус: {{ qr.status }} | Дата: {{ qr.deliveryDate }}
            </q-item-label>
          </q-item-section>
          <q-item-section side>

            <q-btn
              flat
              color="primary"
              icon="edit"
              label="Редактировать"
              @click.stop="openInGenerator(qr)"
            />

            <q-btn
            flat
            color="negative"
            icon="delete"
            label="Удалить"
            @click.stop="deleteQr(qr)"
            class="q-ml-sm"
            />

          </q-item-section>
      </q-item>


      </q-list>
    </div>

    </div>
  </q-page>
</template>

<script lang="ts" setup>
import { QrcodeStream } from 'vue-qrcode-reader'
import { useQrScanner } from '../composables/useQrScanner'

const {
  result,
  loading,
  showCheck,
  myQrCodes,
  showHistory,
  scanHistory,
  deleteHistory,
  onDetect,
  onCameraReady,
  isLink,
  openInGenerator,
  copyResult,
  deleteQr,
  toggleHistory,

} = useQrScanner()
</script>

<style lang="scss" scoped>
@import "../css/qrScannerPageStyle.scss";
</style>
