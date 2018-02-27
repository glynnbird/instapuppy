#!/bin/bash

if [ -z "$COUCH_HOST" ]; then echo "COUCH_HOST is required"; exit 1; fi

# deploy to OpenWhisk
bx wsk package update instapuppy --param COUCH_HOST $COUCH_HOST

# create actions
cd actions
ls *.js | tr '\n' '\0' | xargs -0 -n1 ./deploy_action.sh
cd ..

# create API
bx wsk api create /instapuppy /login post instapuppy/login --response-type http
bx wsk api create /instapuppy /verify post instapuppy/verify --response-type http
bx wsk api create /instapuppy /alldocs post instapuppy/alldocs --response-type http
bx wsk api create /instapuppy /mydocs post instapuppy/mydocs --response-type http
bx wsk api create /instapuppy /userdocs post instapuppy/userdocs --response-type http
