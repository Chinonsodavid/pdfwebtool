const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const pdfRoutes = require('./pdf');

const app = express();
const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || '127.0.0.1';
const DEFAULT_ORIGINS = ['http://127.0.0.1:5173', 'http://localhost:5173'];
const allowedOrigins = (process.env.FRONTEND_ORIGIN || DEFAULT_ORIGINS.join(','))
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean);

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

// Middleware
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve processed files for download
app.use('/downloads', express.static(path.join(__dirname, 'uploads')));

// PDF routes
app.use('/api/pdf', pdfRoutes);

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));

// Cleanup old files every 10 minutes (files older than 30 minutes)
setInterval(() => {
  const now = Date.now();
  fs.readdirSync(uploadsDir).forEach(file => {
    const filePath = path.join(uploadsDir, file);
    const stat = fs.statSync(filePath);
    if (now - stat.mtimeMs > 30 * 60 * 1000) {
      try { fs.unlinkSync(filePath); } catch (e) { /* ignore */ }
    }
  });
}, 10 * 60 * 1000);

if (require.main === module) {
  app.listen(PORT, HOST, () => {
    console.log(`PDF Tools API running on http://${HOST}:${PORT}`);
  });
}

module.exports = app;
