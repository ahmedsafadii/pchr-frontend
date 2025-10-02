// Production Environment Configuration
module.exports = {
  NODE_ENV: 'production',
  NEXT_PUBLIC_APP_ENV: 'production',

  // API Configuration
  NEXT_PUBLIC_API_URL: 'https://api-portal.pchrgaza.org',
  NEXT_PUBLIC_API_BASE_URL: 'https://api-portal.pchrgaza.org/api',

  // Application URLs
  NEXT_PUBLIC_APP_URL: 'https://portal.pchrgaza.org',
  NEXT_PUBLIC_DOMAIN: 'pchrgaza.org',

  // Authentication
  NEXT_PUBLIC_AUTH_SECRET: 'production-secret-key-from-secrets',
  NEXT_PUBLIC_JWT_SECRET: 'production-jwt-secret-from-secrets',

  // File Upload
  NEXT_PUBLIC_MAX_FILE_SIZE: '10485760',
  NEXT_PUBLIC_ALLOWED_FILE_TYPES: 'image/jpeg,image/png,image/gif,application/pdf',

  // Feature Flags
  NEXT_PUBLIC_ENABLE_DEBUG: 'false',
  NEXT_PUBLIC_ENABLE_ANALYTICS: 'true',

  // Logging
  NEXT_PUBLIC_LOG_LEVEL: 'error',

  // Cache Settings
  NEXT_PUBLIC_CACHE_TTL: '3600',

  // Security
  NEXT_PUBLIC_CSP_REPORT_URI: 'https://portal.pchrgaza.org/api/csp-report',
  NEXT_PUBLIC_HSTS_MAX_AGE: '31536000',
};
