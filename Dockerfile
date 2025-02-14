# Utiliser une image Node avec Yarn préinstallé
FROM node:20

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY package*.json yarn*.lock ./

# Installer les dépendances
RUN yarn

COPY . .
