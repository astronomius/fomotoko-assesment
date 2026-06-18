FROM php:8.2-cli-alpine

# Install system dependencies
RUN apk add --no-cache \
    bash \
    git \
    curl \
    curl-dev \
    libzip-dev \
    postgresql-dev \
    unzip \
    zip \
    $PHPIZE_DEPS

# Install PHP extensions
RUN docker-php-ext-install pdo pdo_pgsql pgsql zip curl

# Copy Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /workspace

# Set entrypoint
ENTRYPOINT ["/bin/bash", "/workspace/entrypoint.sh"]
