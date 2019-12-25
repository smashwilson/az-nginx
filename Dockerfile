FROM alpine:3.11.2
LABEL maintainer "Ash Wilson"

RUN apk add --no-cache nginx
RUN mkdir -p /etc/ssl /var/cache/nginx /var/tmp/nginx /run/nginx/ \
  /var/www/backend.azurefire.net

ADD script/container/entrypoint.sh /script/container/entrypoint.sh

ADD nginx.conf /etc/nginx/nginx.conf
ADD ssl.conf /etc/nginx/ssl.conf
ADD vhosts/ /etc/nginx/vhosts/
ADD backend.azurefire.net/ /var/www/backend.azurefire.net/

EXPOSE 80 443
STOPSIGNAL SIGQUIT

ENTRYPOINT ["/script/container/entrypoint.sh"]
