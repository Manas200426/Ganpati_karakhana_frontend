# Build Stage
FROM node:22 AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Add this line
RUN echo "BUILD VITE_API_URL=$VITE_API_URL"

RUN npm run build

# Production Stage
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.config /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]