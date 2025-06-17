FROM node:18-alpine
WORKDIR /app
COPY . /app
RUN npm install -g http-server
EXPOSE 8090
CMD ["http-server", "-p", "8090"]
