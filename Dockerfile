FROM alpine:3.6
LABEL maintainer "Ash Wilson"

RUN apk add --no-cache nginx python3
RUN mkdir -p /etc/ssl /var/cache/nginx /var/tmp/nginx /var/www/pushbot.party
RUN ln -s /usr/bin/python3 /usr/bin/python && \
  ln -s /usr/bin/pip3 /usr/bin/pip
ADD nginx.conf /etc/nginx/nginx.conf
ADD vhosts/ /etc/nginx/vhosts/
ADD pushbot.party/ /var/www/pushbot.party/

EXPOSE 80 443
STOPSIGNAL SIGQUIT

ENTRYPOINT ["/bin/sh"]
