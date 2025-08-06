# Stage 1: Build
FROM node:18 as build

WORKDIR /app

# Install NestJS CLI
RUN npm install --global @nestjs/cli

# Install dependencies
COPY package.json yarn.lock ./
RUN yarn install

COPY . .
COPY proto ./proto
RUN yarn run build

RUN mkdir -p dist/proto && cp -r proto/* dist/proto/

# Stage 2: Production
FROM node:18-alpine

WORKDIR /app

# Install production dependencies
COPY package.json yarn.lock ./
RUN yarn install --production

# Install TypeScript and ts-node
RUN yarn add typescript ts-node tsconfig-paths

# Copy build
COPY --from=build /app/dist /app/dist

COPY --from=build /app/dist/proto ./proto


COPY tsconfig.json ./


# Start
CMD sh -c "yarn start:prod"