# مرحله 1: نصب dependency‌ها
FROM node:20-alpine AS deps
WORKDIR /app

# فقط فایل‌های مربوط به نصب
COPY package.json package-lock.json* ./

# نصب dependency‌ها
RUN npm ci

# مرحله 2: بیلد پروژه
FROM node:20-alpine AS builder
WORKDIR /app

# کپی کردن node_modules و سورس
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# بیلد next
RUN npm run build

# مرحله 3: ران‌تایم
FROM node:20-alpine AS runner
WORKDIR /app

# فقط فایل‌های لازم برای اجرا
ENV NODE_ENV=production

# کپی از مرحله بیلد
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# تنظیم پورت
EXPOSE 3000
ENV PORT=3000

# اجرای برنامه
CMD ["npm", "start"]
