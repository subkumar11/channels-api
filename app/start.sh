#!/bin/bash
if [ "$NODE_ENV" = "production" ]
then
  npm start
else
  npm run docs
  npm run dev
fi
