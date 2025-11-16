FROM node:18-alpine

# Устанавливаем Python и pip
RUN apk add --no-cache python3 py3-pip

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и устанавливаем зависимости Node.js
COPY package*.json ./
RUN npm install

# Копируем requirements.txt и устанавливаем зависимости Python
COPY ai_modul/requirements.txt ./ai_modul/
RUN pip3 install --no-cache-dir -r ai_modul/requirements.txt

# Копируем весь код
COPY . .

# Открываем порт
EXPOSE 3000

# Запускаем приложение
CMD ["npm", "start"]