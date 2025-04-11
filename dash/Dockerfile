FROM node:18 AS build
WORKDIR /app

# Copiar package.json e instalar dependencias
COPY package*.json ./
RUN npm install

# Copiar el resto del código
COPY . .

# Asegurar que la variable de entorno esté disponible durante la compilación
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL:-https://topfutbol-api-production.up.railway.app}

# Compilar la aplicación
RUN npm run build

FROM nginx:1.21
# Copiar los archivos compilados
COPY --from=build /app/dist /usr/share/nginx/html
# Copiar la configuración de nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]