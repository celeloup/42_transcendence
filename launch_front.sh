#!/bin/bash

#test front
cd nuxt_front_test
[[ -d node_modules ]] || npm install
npm run dev