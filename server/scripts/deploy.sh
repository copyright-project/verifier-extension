#!/usr/bin/env bash

heroku container:login
heroku container:push web -a verifier-extension-server
heroku container:release web -a verifier-extension-server