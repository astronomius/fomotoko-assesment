FROM php:8.2-cli-alpine

RUN apk add --no-cache \
    bash \
    git \
    curl \
    curl-dev \
    libzip-dev \
    unzip \
    zip \
    $PHPIZE_DEPS

RUN docker-php-ext-install pdo pdo_mysql zip curl

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /workspace

ENTRYPOINT ["/bin/bash", "/workspace/entrypoint.sh"]
