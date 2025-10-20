# --- Stage 1: Build the application ---
# This stage installs dependencies, including devDependencies, and builds the TypeScript source code into JavaScript.
FROM node:18-alpine AS builder

WORKDIR /usr/src/app

# Install pnpm globally
RUN npm install -g pnpm

# Copy dependency definition files
COPY package.json pnpm-lock.yaml ./

# Install all dependencies (including dev dependencies needed for build)
RUN pnpm install --frozen-lockfile

# Copy the rest of the application source code
COPY . .

# Build the application
# This command transpiles TypeScript to JavaScript and places it in the /dist folder.
RUN pnpm run build

# --- Stage 2: Create the lean production image ---
# This stage takes only the build artifacts and production dependencies to create a small, secure final image.
FROM node:18-alpine

WORKDIR /usr/src/app

# Install pnpm globally
RUN npm install -g pnpm

# Copy dependency definition files
COPY package.json pnpm-lock.yaml ./

# Install ONLY production dependencies to keep the image size small
RUN pnpm install --prod --frozen-lockfile

# Copy the built application from the 'builder' stage
COPY --from=builder /usr/src/app/dist ./dist

# Expose the port the app runs on
EXPOSE 3000

# The command to run the application in production
CMD ["node", "dist/main"]
