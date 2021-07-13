#!/bin/bash

# DB
# create postgres_data folder if not exist
[[ -d postgres_data ]] || mkdir postgres_data
# launch db (should be stopped)
docker-compose up -d

# BACK
cd nestjs_back
# install module if not exist
[[ -d node_modules ]] || npm install
# start back
npm run start