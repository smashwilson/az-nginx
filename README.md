# azurefire nginx

[![Build Status](https://travis-ci.org/smashwilson/azurefire-nginx.svg?branch=master)](https://travis-ci.org/smashwilson/azurefire-nginx) [![Docker Repository on Quay](https://quay.io/repository/smashwilson/azurefire-nginx/status "Docker Repository on Quay")](https://quay.io/repository/smashwilson/azurefire-nginx)

nginx container the provides the frontend for azurefire.net and related domains. The nginx container is responsible for serving root static assets and forwarding connections to other backend services, like [pushbot](https://github.com/smashwilson/pushbot).
