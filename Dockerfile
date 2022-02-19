FROM node:16 AS builder

WORKDIR /app

COPY package.json .
COPY package-lock.json .

# NOTE: Need --legacy-peer-deps to resolve version conflict between webpack
# and uglifyjs. Would be much better to not need this.
RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build

FROM nginx:1.17.3

RUN rm /etc/nginx/conf.d/default.conf
COPY ./nginx.conf /etc/nginx/conf.d/nginx.conf.template

# This is a hack around the envsubst nginx config. Because we have `$uri` set
# up, it would replace this as well. Now we just reset it to its original value.
ENV uri \$uri

ENV PORT $PORT
ENV SERVER_NAME _

ENV ESC='$'

EXPOSE $PORT

COPY --from=builder /app/dist /var/www

CMD ["sh", "-c", "envsubst < /etc/nginx/conf.d/nginx.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]
