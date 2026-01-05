import { boot } from 'quasar/wrappers';
import axios from 'axios';

const api = axios.create({
  //Вставьте свой cloudflared URL
  baseURL: 'https://health-compact-intend-hamilton.trycloudflare.com/api',
});

export default boot(({ app }) => {
  app.config.globalProperties.$api = api;
});

export { api };

