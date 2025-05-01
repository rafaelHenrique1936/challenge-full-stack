
const isVite = typeof import.meta !== 'undefined' && typeof import.meta.env !== 'undefined';

function getEnv(key, defaultValue = '') {
  if (isVite) {
    return import.meta.env[key] || defaultValue;
  } else {
    return typeof process !== 'undefined' && process.env && process.env[key] 
      ? process.env[key] 
      : defaultValue;
  }
}

let apiUrl;
if (isVite) {
  apiUrl = getEnv('VITE_API_URL') || getEnv('VITE_APP_API_URL');
} else {
  apiUrl = getEnv('VUE_APP_API_URL');
}

export const API_URL = apiUrl || 'http://localhost:3050';

export const ENV = getEnv('NODE_ENV', 'development');
export const IS_PRODUCTION = ENV === 'production';
export const IS_DEVELOPMENT = ENV === 'development';

export const CONFIG = {
  requestTimeout: IS_PRODUCTION ? 30000 : 60000,
  
  enableDetailedLogs: IS_DEVELOPMENT,
};

export function getApiUrl(path = '') {
  const basePath = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL;
  const apiPath = path.startsWith('/') ? path : `/${path}`;
  return `${basePath}${apiPath}`;
}

if (IS_DEVELOPMENT) {
  console.log('Configurações de ambiente carregadas:', {
    API_URL,
    ENV,
    IS_PRODUCTION,
    IS_DEVELOPMENT
  });
}

export default {
  API_URL,
  ENV,
  IS_PRODUCTION,
  IS_DEVELOPMENT,
  CONFIG,
  getApiUrl,
};