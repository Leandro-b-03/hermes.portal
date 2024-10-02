FROM node:lts-alpine

# Add metadata labels (following best practices)
LABEL org.opencontainers.image.title="Hermes Frontend" \
      org.opencontainers.image.description="Nuxt 3 frontend for hermes" \
      org.opencontainers.image.version="0.0.1" \
      org.opencontainers.image.authors="Leandro Bezerra <leandro.b.03@gmail.com>" \
      org.opencontainers.image.source="https://github.com/Leandro-b-03/hermes-portal"

# Set working directory
WORKDIR /app

# Copy only package files first for efficient caching
COPY package*.json ./

# Install dependencies
RUN apk add --no-cache --update \
    g++ \
    make \
    autoconf \
    automake \
    libtool \
    nasm \
    pkgconf \
    rust \
    cargo \
    nano

# Install Resvg
RUN npm install @resvg/resvg-js

RUN cargo install wasm-pack

# Install dependencies (including devDependencies for Vite)
RUN npm install
RUN npm audit fix

# Copy the rest of the source code
COPY . .

# Expose the port your app will run on (default for Vite)
EXPOSE 5173

# Define the default command to run your app (adjust if needed)
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173", "--no-open"]
# CMD ["tail", "-f", "/dev/null"]