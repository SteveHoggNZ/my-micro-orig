#!/bin/bash

SERVICES_DIR='services'
BUILD_COMMAND='npm i && npm run build'

cd "${SERVICES_DIR}/${BUILD_TAG}"

echo "=== Running Build ==="

eval ${BUILD_COMMAND}
