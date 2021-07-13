#!/bin/bash
[[ -d postgres_data ]] || mkdir postgres_data
docker-compose up -d
cd nestjs_back
npm run start