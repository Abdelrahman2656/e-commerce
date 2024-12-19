FROM node:23
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ENV PORT 3000
EXPOSE 3000
CMD ["node", "index.js"]
