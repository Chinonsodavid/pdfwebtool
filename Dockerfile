FROM node:22-bookworm-slim

ENV NODE_ENV=production
ENV HOST=0.0.0.0

WORKDIR /app

RUN apt-get update \
  && apt-get install -y --no-install-recommends \
    ca-certificates \
    fonts-dejavu-core \
    fonts-liberation \
    ghostscript \
    libreoffice \
    libreoffice-calc \
    libreoffice-impress \
    poppler-utils \
    qpdf \
    tesseract-ocr \
    tesseract-ocr-eng \
  && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .
RUN mkdir -p uploads

EXPOSE 3001

CMD ["node", "server.js"]
