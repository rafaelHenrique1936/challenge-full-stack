import axios from 'axios';
import { API_URL, CONFIG } from '@/config/env';
import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from 'pinia';

axios.defaults.baseURL = API_URL;
axios.defaults.timeout = CONFIG.requestTimeout;
axios.defaults.headers.common['Content-Type'] = 'application/json';

axios.interceptors.request.use(
  (config) => {
    
    try {
      const authStore = useAuthStore();
      const { token } = storeToRefs(authStore);
      
      if (token.value) {
        config.headers.Authorization = `Bearer ${token.value}`;
      }
    } catch (error) {
      console.warn('Não foi possível acessar o store de autenticação:', error);
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      const status = error.response.status;
      
      if (status === 401) {
        try {
          const authStore = useAuthStore();
          
          if (window.location.pathname !== '/login') {
            console.warn('Token expirado ou inválido. Redirecionando para login...');
            authStore.logout();
            window.location.href = '/login';
          }
        } catch (e) {
          console.error('Erro ao processar logout após 401:', e);
        }
      }
      
      // Log detalhado em desenvolvimento
      if (CONFIG.enableDetailedLogs) {
        console.error('Erro na resposta da API:', {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data,
          url: error.config.url,
          method: error.config.method,
        });
      }
    } else if (error.request) {
      console.error('Sem resposta do servidor:', error.request);
    } else {
      console.error('Erro na configuração da requisição:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default axios;