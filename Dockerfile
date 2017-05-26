FROM alpine:3.6
LABEL maintainer "Ash Wilson"

RUN apk add --no-cache nginx curl

ENTRYPOINT ["/bin/sh"]
