#!/bin/bash

set -e

npm install --save-dev @babylonjs/core
npm install --save-dev @babylonjs/inspector

npm install --save-dev typescript webpack ts-loader webpack-cli

npm install --save-dev html-webpack-plugin
npm install --save-dev webpack-dev-server

npm run build

npm run start
