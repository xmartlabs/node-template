# Start with fully-featured Node.js base image
FROM node:20.9.0 AS builder
WORKDIR /home/node/app

# Copy dependency information and install production dependencies
COPY *.json ./

RUN npm install --production --pure-lockfile --ignore-scripts
RUN cp -RL node_modules/ /tmp/node_modules/

# Install all dependencies
RUN npm install --pure-lockfile --ignore-scripts

# Copy source code (and all other relevant files)
COPY . .

# Build code
RUN npx prisma generate
RUN npm run build


# Run-time stage
FROM node:20.9.0-alpine

WORKDIR /home/node/app

# Copy runtime dependencies
COPY --from=builder /tmp/node_modules/ ./node_modules/
COPY --from=builder /home/node/app/node_modules/@prisma ./node_modules/@prisma/
COPY --from=builder /home/node/app/node_modules/.prisma ./node_modules/.prisma/
COPY --from=builder /home/node/app/node_modules/.bin ./node_modules/.bin/
COPY --from=builder /home/node/app/prisma ./prisma

# Copy runtime project
COPY --from=builder /home/node/app/dist ./dist
COPY --from=builder /home/node/app/package*.json ./
COPY --from=builder /home/node/app/tsconfig.json ./

EXPOSE 8080

CMD [ "npm", "run", "deploy" ]
