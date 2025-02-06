FROM node:23

WORKDIR /app
COPY . .

RUN npm install
RUN npm install pm2 -g
RUN pm2 install pm2-server-monit

# Remove hardcoded keys and use ARG for build-time variables
ARG PM2_PUBLIC_KEY
ARG PM2_PRIVATE_KEY
ENV PM2_PUBLIC_KEY=${PM2_PUBLIC_KEY}
ENV PM2_PRIVATE_KEY=${PM2_PRIVATE_KEY}

# Set machine name for PM2
ENV PM2_MACHINE_NAME="dcf-backend-container"

RUN npm run build

EXPOSE 3000

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/status || exit 1

# Update CMD to use correct PM2 linking order
CMD ["sh", "-c", "pm2 link ${PM2_PRIVATE_KEY} ${PM2_PUBLIC_KEY} && pm2-runtime start ecosystem.config.cjs"]