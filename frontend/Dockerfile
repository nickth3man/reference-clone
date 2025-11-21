FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

# Install dependencies if package.json exists (it won't initially, but this is for later)
RUN if [ -f package.json ]; then npm install; fi

COPY . .

CMD ["npm", "run", "dev"]
