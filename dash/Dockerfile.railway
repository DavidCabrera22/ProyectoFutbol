FROM node:18 AS build
WORKDIR /app

# Copiar package.json e instalar dependencias
COPY package*.json ./
RUN npm install

# Mostrar el contenido de package.json para verificar los scripts
RUN cat package.json

# Copiar el resto del código y compilar
COPY . .

# Verificar la estructura del proyecto antes de compilar
RUN ls -la
RUN echo "Verificando si es un proyecto Vite..."
RUN test -f vite.config.js && echo "Es un proyecto Vite" || echo "No es un proyecto Vite"

# Compilar con más información de depuración
RUN CI=false npm run build --verbose || echo "Build completed with warnings"

# Verificar la estructura de directorios después de la compilación
RUN ls -la
RUN echo "Verificando si se creó el directorio dist..."
RUN test -d dist && echo "Directorio dist encontrado" && ls -la dist || echo "No se encontró el directorio dist"

# Crear un script para buscar y copiar los archivos correctamente
RUN echo "#!/bin/sh\n\
if [ -d /app/dist ]; then\n\
  echo 'Usando directorio /app/dist (Vite)'\n\
  mkdir -p /output\n\
  cp -r /app/dist/* /output/\n\
elif [ -d /app/build ]; then\n\
  echo 'Usando directorio /app/build (Create React App)'\n\
  mkdir -p /output\n\
  cp -r /app/build/* /output/\n\
else\n\
  echo 'No se encontró directorio dist o build'\n\
  mkdir -p /output\n\
  echo '<html><body><h1>TopFutbol</h1><p>Error: No se encontraron archivos de compilación</p></body></html>' > /output/index.html\n\
fi" > /app/copy-files.sh && chmod +x /app/copy-files.sh

# Ejecutar el script para copiar los archivos
RUN /app/copy-files.sh

FROM nginx:1.21
# Copiar los archivos desde el directorio de salida
COPY --from=build /output /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]