const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const pdfRoutes = require('./pdf');

const app = express();
const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || '127.0.0.1';
const DEFAULT_ORIGINS = [
  'http://127.0.0.1:5173',
  'http://localhost:5173',
  'http://127.0.0.1:4173',
  'http://localhost:4173',
  'https://pdforge-xi.vercel.app',
];

function normalizeOrigin(origin) {
  if (!origin) return '';

  try {
    return new URL(origin).origin;
  } catch {
    return origin.replace(/\/+$/, '');
  }
}

const configuredOrigins = (process.env.FRONTEND_ORIGIN || '')
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean);

const allowedOrigins = new Set([...DEFAULT_ORIGINS, ...configuredOrigins].map(normalizeOrigin));
const allowedVercelPrefixes = (process.env.VERCEL_ORIGIN_PREFIXES || 'pdforge-')
  .split(',')
  .map(prefix => prefix.trim())
  .filter(Boolean);

const CSP_DIRECTIVES = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "script-src 'self' https://accounts.google.com/gsi/client https://apis.google.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  "img-src 'self' data: blob: https:",
  "connect-src 'self' blob: https://pdfwebtool-ls3x.onrender.com https://accounts.google.com https://*.google.com http://127.0.0.1:3001 http://localhost:3001 https://apis.google.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://firebaseinstallations.googleapis.com",
  "frame-src 'self' https://accounts.google.com https://pdf-project-7030f.firebaseapp.com",
  "worker-src 'self' blob:",
  "media-src 'self' blob:",
  "form-action 'self' https://accounts.google.com",
].join('; ');

function isAllowedOrigin(origin) {
  const normalized = normalizeOrigin(origin);
  if (allowedOrigins.has(normalized)) return true;

  try {
    const { hostname, protocol } = new URL(normalized);
    return protocol === 'https:' && hostname.endsWith('.vercel.app') && allowedVercelPrefixes.some(prefix => hostname.startsWith(prefix));
  } catch {
    return false;
  }
}

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

// Middleware
app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', CSP_DIRECTIVES);
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), browsing-topics=()');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  next();
});

app.use(cors({
  origin(origin, callback) {
    if (!origin || isAllowedOrigin(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve processed files for preview and download
app.use('/preview', express.static(path.join(__dirname, 'uploads'), {
  setHeaders(res, filePath) {
    const filename = path.basename(filePath).replaceAll('"', '');
    res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
    res.setHeader('X-Content-Type-Options', 'nosniff');
  },
}));

app.use('/downloads', express.static(path.join(__dirname, 'uploads'), {
  setHeaders(res, filePath) {
    const filename = path.basename(filePath).replaceAll('"', '');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('X-Content-Type-Options', 'nosniff');
  },
}));

// PDF routes
app.use('/api/pdf', pdfRoutes);

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));

function cleanupOldUploads() {
  const now = Date.now();
  fs.readdirSync(uploadsDir).forEach(file => {
    const filePath = path.join(uploadsDir, file);
    const stat = fs.statSync(filePath);
    if (now - stat.mtimeMs > 30 * 60 * 1000) {
      try { fs.unlinkSync(filePath); } catch (e) { /* ignore */ }
    }
  });
}

if (require.main === module) {
  // Cleanup old files every 10 minutes (files older than 30 minutes)
  setInterval(cleanupOldUploads, 10 * 60 * 1000);
  app.listen(PORT, HOST, () => {
    console.log(`PDF Tools API running on http://${HOST}:${PORT}`);
  });
}

module.exports = app;
