// Example Environment Configuration
// Copy this file to environment.local.js and update the values

module.exports = {
  NODE_ENV: 'development',
  NEXT_PUBLIC_APP_ENV: 'development',

  // API Configuration
  NEXT_PUBLIC_API_URL: 'http://localhost:8000',
  NEXT_PUBLIC_API_BASE_URL: 'http://localhost:8000/api',

  // Application URLs
  NEXT_PUBLIC_APP_URL: 'http://localhost:3000',
  NEXT_PUBLIC_DOMAIN: 'localhost:3000',

  // Authentication
  NEXT_PUBLIC_AUTH_SECRET: 'your-local-secret-key',
  NEXT_PUBLIC_JWT_SECRET: 'your-local-jwt-secret',

  // File Upload
  NEXT_PUBLIC_MAX_FILE_SIZE: '10485760',
  NEXT_PUBLIC_ALLOWED_FILE_TYPES: 'image/jpeg,image/png,image/gif,application/pdf',

  // Feature Flags
  NEXT_PUBLIC_ENABLE_DEBUG: 'true',
  NEXT_PUBLIC_ENABLE_ANALYTICS: 'false',

  // Logging
  NEXT_PUBLIC_LOG_LEVEL: 'debug',

  // Cache Settings
  NEXT_PUBLIC_CACHE_TTL: '300',

  // Security
  NEXT_PUBLIC_CSP_REPORT_URI: '',
  NEXT_PUBLIC_HSTS_MAX_AGE: '0',
};
