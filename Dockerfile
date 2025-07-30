# 1. Imagen base de Node.js
FROM node:18

# 2. Establecer el directorio de trabajo dentro del contenedor
WORKDIR /app

# 3. Copiar los archivos de dependencias
COPY package*.json ./

# 4. Instalar dependencias
RUN npm install

# 5. Copiar el resto del proyecto
COPY . .

# 6. Expone el puerto que usará el backend (Cloud Run espera el 8080)
EXPOSE 8080

# 7. Comando para arrancar tu servidor
CMD ["node", "server.js"]
