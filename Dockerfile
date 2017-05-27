FROM alpine:3.6
LABEL maintainer "Ash Wilson"

RUN apk add --no-cache nginx python3
RUN addgroup -S nginx && \
  adduser -D -S -h /var/cache/nginx -s /sbin/nologin -G nginx nginx
RUN mkdir -p /etc/ssl /var/cache/nginx /var/tmp/nginx /var/www/pushbot.party
ADD nginx.conf /etc/nginx/nginx.conf
ADD vhosts/ /etc/nginx/vhosts/
ADD pushbot.party/ /var/www/pushbot.party/

EXPOSE 80 443
STOPSIGNAL SIGQUIT

ENTRYPOINT ["/bin/sh"]
