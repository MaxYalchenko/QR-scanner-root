<template>
  <q-page class="flex flex-center">
    <q-card class="q-pa-md" style="width: 400px;">
      <q-tabs v-model="tab" dense>
        <q-tab name="login" label="Вход" />
        <q-tab name="register" label="Регистрация" />
      </q-tabs>

      <q-separator />

      <div v-if="tab === 'login'" class="q-mt-md">
        <q-input v-model="loginEmail" label="Email" type="email" outlined />
        <q-input v-model="loginPassword" label="Пароль" type="password" outlined class="q-mt-sm" />
        <q-btn label="Войти" color="primary" class="q-mt-md" @click="handleLogin" :loading="loading" />
      </div>

      <div v-if="tab === 'register'" class="q-mt-md">
        <q-input v-model="registerEmail" label="Email" type="email" outlined />
        <q-input v-model="registerPassword" label="Пароль" type="password" outlined class="q-mt-sm" />
        <q-btn label="Зарегистрироваться" color="primary" class="q-mt-md" @click="handleRegister" :loading="loading" />
      </div>

      <q-banner v-if="errorMessage" class="q-mt-md" dense color="negative" icon="warning">
        {{ errorMessage }}
      </q-banner>
    </q-card>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
import { AuthApi} from 'src/api/auth';
import type { AuthResponse } from 'src/api/auth';


export default defineComponent({
  name: 'AuthorizationPage',
  setup() {
    const router = useRouter();

    const tab = ref<'login' | 'register'>('login');
    const loginEmail = ref('');
    const loginPassword = ref('');
    const registerEmail = ref('');
    const registerPassword = ref('');
    const errorMessage = ref('');
    const loading = ref(false);

    const handleLogin = async () => {
    errorMessage.value = '';
    loading.value = true;
    try {
      const response = await AuthApi.login({ email: loginEmail.value, password: loginPassword.value });
      const data: AuthResponse = response.data;

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      await router.push('/');
    } catch (err) {
      // Типизация ошибки через unknown
      const e = err as { response?: { data?: { message?: string } } };
      errorMessage.value = e.response?.data?.message || 'Ошибка входа';
    } finally {
      loading.value = false;
    }
  };

    const handleRegister = async () => {
    errorMessage.value = '';
    loading.value = true;
    try {
      const response = await AuthApi.register({ email: registerEmail.value, password: registerPassword.value });
      const data: AuthResponse = response.data;

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      await router.push('/');
    } catch (err) {
      const e = err as { response?: { data?: { message?: string } } };
      errorMessage.value = e.response?.data?.message || 'Ошибка регистрации';
    } finally {
      loading.value = false;
    }
  };

    return {
      tab,
      loginEmail,
      loginPassword,
      registerEmail,
      registerPassword,
      handleLogin,
      handleRegister,
      errorMessage,
      loading,
    };
  },
});
</script>

<style scoped>
.q-page {
  min-height: 100vh;
}
</style>
