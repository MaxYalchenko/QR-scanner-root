import { boot } from 'quasar/wrappers';
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://pants-renewal-aggregate-membership.trycloudflare.com/api',
});

export default boot(({ app }) => {
  app.config.globalProperties.$api = api;
});

export { api };
