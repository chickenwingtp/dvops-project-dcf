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

# Create startup script
RUN echo '#!/bin/sh\n\
pm2 link $PM2_PRIVATE_KEY $PM2_PUBLIC_KEY || true\n\
sleep 5\n\
pm2-runtime start ecosystem.config.cjs\n'\
> /app/startup.sh && chmod +x /app/startup.sh

# Use startup script
CMD ["/app/startup.sh"]