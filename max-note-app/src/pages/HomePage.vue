<template>
  <q-page class="flex flex-center">
    <q-card class="q-pa-md" style="max-width: 500px; width: 90%; text-align: center">
      <h3>{{ userEmail }}</h3>

      <q-btn
        label="Генератор QR"
        color="primary"
        class="q-mt-md full-width"
        icon="qr_code_2"
        @click="goToQrGenerator"
      />

      <q-btn
        label="Сканер"
        color="primary"
        class="q-mt-md full-width"
        icon="qr_code_2"
        @click="goToScaner"
      />

      <q-btn
        label="Выйти"
        color="negative"
        class="q-mt-sm full-width"
        icon="logout"
        @click="handleLogout"
      />
    </q-card>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import type { User } from 'src/types/user';

export default defineComponent({
  name: 'HomePage',
  setup() {
    const router = useRouter();
    const userEmail = ref<string>('');

    onMounted(() => {
      const userData = localStorage.getItem('user');
      if (!userData) {
        void router.push('/auth');
      } else {
        const user: User = JSON.parse(userData);
        userEmail.value = user.email;
      }
    });

    const goToQrGenerator = () => {
      void router.push('qr-generator');
    };

    const goToScaner = () => {
      void router.push('qr-scanner');
    };

    const handleLogout = () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      void router.push('/auth');
    };

    return {
      userEmail,
      goToQrGenerator,
      handleLogout,
      goToScaner,
    };
  },
});
</script>

<style scoped>
.q-page {
  min-height: 100vh;
}
</style>
