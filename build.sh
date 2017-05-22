#!/bin/bash

ARTIFACT_DIR="${PWD}/artifacts"

mkdir -p ${ARTIFACT_DIR}

SERVICES_DIR='services'
BUILD_COMMAND='npm i && npm run build && cp .serverless/* ${ARTIFACT_DIR}'

zip -r tmp.zip .serverless

cd "${SERVICES_DIR}/${BUILD_TAG}"

echo "=== Running Build ==="

eval ${BUILD_COMMAND}
