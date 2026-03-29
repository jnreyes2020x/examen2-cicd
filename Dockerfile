# ============================================================
# Dockerfile CORREGIDO - Examen 2, Actividad 1 Parte A
# Errores corregidos:
#   ERROR 1: FROM node:latest → FROM node:18-alpine (versión específica, imagen liviana)
#   ERROR 2: COPY . . antes de instalar → separar COPY package*.json y luego COPY . .
#   ERROR 3: npm install sin RUN → RUN npm install --production
#   ERROR 4: EXPOSE 80 → EXPOSE 3000 (puerto real de la app Node.js)
# ============================================================

# ERROR 1 CORREGIDO: imagen específica y liviana en lugar de :latest
FROM node:18-alpine

WORKDIR /app

# ERROR 2 CORREGIDO: primero copiamos solo package*.json para aprovechar cache de capas
COPY package*.json ./

# ERROR 3 CORREGIDO: se agrega la instrucción RUN antes del comando
RUN npm install --production

# Ahora sí copiamos el resto del código fuente
COPY . .

# ERROR 4 CORREGIDO: puerto 3000 que es el que realmente usa la app Node.js
EXPOSE 3000

# Best practice: forma exec (array JSON) en lugar de forma shell
CMD ["node", "index.js"]
