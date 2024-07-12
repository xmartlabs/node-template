# Start with fully-featured Node.js base image
FROM node:20.9.0 AS builder
RUN npm i -g npm@10.1.0
WORKDIR /home/node/app

# Copy dependency information and install production dependencies
COPY *.json ./

# Install all dependencies
RUN npm ci --ignore-scripts

# Copy source code (and all other relevant files)
COPY . .

# Build code
RUN npx prisma generate
RUN npm run build


# Run-time stage
FROM node:20.9.0-alpine
RUN npm i -g npm@10.1.0

WORKDIR /home/node/app

# Copy runtime project
COPY --from=builder /home/node/app/dist ./dist
COPY --from=builder /home/node/app/src/emails/*.pug ./dist/src/emails/
COPY --from=builder /home/node/app/package*.json ./
COPY --from=builder /home/node/app/tsconfig.json ./

# Install runtime dependencies
RUN npm ci --omit=dev --ignore-scripts

COPY --from=builder /home/node/app/node_modules/@prisma ./node_modules/@prisma/
COPY --from=builder /home/node/app/node_modules/.prisma ./node_modules/.prisma/
COPY --from=builder /home/node/app/node_modules/.bin ./node_modules/.bin/
COPY --from=builder /home/node/app/prisma ./prisma

EXPOSE 8080

CMD [ "npm", "run", "deploy" ]
