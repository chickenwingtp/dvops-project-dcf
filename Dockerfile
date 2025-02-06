FROM node:23

WORKDIR /app
COPY . .

RUN npm install
RUN npm install pm2 -g
RUN npm run build

EXPOSE 3000

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/status || exit 1

CMD [ "pm2-runtime", "start", "ecosystem.config.cjs" ]