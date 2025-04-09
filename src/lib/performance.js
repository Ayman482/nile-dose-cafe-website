// Performance optimization utilities for Nile Dose Cafe website

/**
 * Image optimization configuration for Astro
 * @returns {object} - Image optimization configuration
 */
export function getImageOptimizationConfig() {
  return {
    // Default image service configuration
    service: {
      entrypoint: 'astro/assets/services/sharp',
      config: {
        quality: 80, // Default quality for images
        format: ['webp', 'avif', 'png', 'jpeg'] // Preferred formats in order
      }
    },
    // Default image dimensions
    dimensions: [640, 750, 828, 1080, 1200, 1920],
    // Default image formats
    formats: ['webp', 'avif', 'png', 'jpeg'],
    // Default image quality
    quality: 80,
    // Default image loading
    loading: 'lazy',
    // Default image decoding
    decoding: 'async'
  };
}

/**
 * Generate preload links for critical resources
 * @returns {Array} - Array of preload link objects
 */
export function getCriticalPreloads() {
  return [
    // Preload Cairo font for Arabic text
    {
      rel: 'preload',
      href: '/fonts/Cairo-Regular.woff2',
      as: 'font',
      type: 'font/woff2',
      crossorigin: true
    },
    // Preload logo image
    {
      rel: 'preload',
      href: '/images/logo.png',
      as: 'image',
      type: 'image/png'
    },
    // Preload critical CSS
    {
      rel: 'preload',
      href: '/styles/critical.css',
      as: 'style'
    }
  ];
}

/**
 * Generate cache control headers for different asset types
 * @returns {object} - Cache control headers by asset type
 */
export function getCacheControlHeaders() {
  return {
    // HTML pages - short cache time
    html: 'public, max-age=3600', // 1 hour
    // CSS and JS - longer cache time with validation
    css: 'public, max-age=86400, must-revalidate', // 1 day
    js: 'public, max-age=86400, must-revalidate', // 1 day
    // Images - long cache time
    images: 'public, max-age=604800, immutable', // 7 days
    // Fonts - very long cache time
    fonts: 'public, max-age=31536000, immutable', // 1 year
    // Default
    default: 'public, max-age=3600' // 1 hour
  };
}

/**
 * Generate Content Security Policy (CSP) header
 * @returns {string} - CSP header value
 */
export function getContentSecurityPolicy() {
  return `
    default-src 'self';
    script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://www.googletagmanager.com;
    style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://fonts.googleapis.com;
    img-src 'self' data: https://res.cloudinary.com;
    font-src 'self' https://fonts.gstatic.com;
    connect-src 'self' https://*.supabase.co;
    frame-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
  `.replace(/\s+/g, ' ').trim();
}

/**
 * Generate security headers for the website
 * @returns {object} - Security headers
 */
export function getSecurityHeaders() {
  return {
    // Content Security Policy
    'Content-Security-Policy': getContentSecurityPolicy(),
    // Prevent MIME type sniffing
    'X-Content-Type-Options': 'nosniff',
    // Prevent clickjacking
    'X-Frame-Options': 'DENY',
    // Enable XSS protection in browsers
    'X-XSS-Protection': '1; mode=block',
    // Strict Transport Security
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
    // Referrer Policy
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    // Permissions Policy
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
  };
}

export default {
  getImageOptimizationConfig,
  getCriticalPreloads,
  getCacheControlHeaders,
  getContentSecurityPolicy,
  getSecurityHeaders
};
