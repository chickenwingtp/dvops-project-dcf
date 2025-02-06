FROM node:23

WORKDIR /app
COPY . .

RUN npm install
RUN npm install pm2 -g
RUN pm2 install pm2-server-monit

# Remove hardcoded keys and use ARG for build-time variables
ENV PM2_PUBLIC_KEY li58btqtkcia788
ENV PM2_SECRET_KEY 8nnq1gobty5fv33

# Set machine name for PM2
ENV PM2_MACHINE_NAME="dcf-backend-container"

RUN npm run build

EXPOSE 3000

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/status || exit 1

CMD ["pm2-runtime", "index.ts"]