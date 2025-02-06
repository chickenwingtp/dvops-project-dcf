FROM node:23

WORKDIR /app
COPY . .

RUN npm install
RUN npm install pm2 -g
RUN pm2 install pm2-server-monit

# Add PM2 monitoring setup
ENV PM2_PUBLIC_KEY="q2pwmmbba6wgs9k"
ENV PM2_PRIVATE_KEY="fo46q2hqe29noqy"

RUN npm run build

EXPOSE 3000

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/status || exit 1

CMD [ "pm2-runtime", "start", "ecosystem.config.cjs" ]