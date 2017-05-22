#!/bin/bash

ARTIFACT_DIR="${PWD}/artifacts"

mkdir -p ${ARTIFACT_DIR}

BUILD_NAME="${BUILD_TAG}"
SERVICES_DIR='services'
BUILD_COMMAND='npm i && npm run build && mv .serverless ${ARTIFACT_DIR}/${BUILD_NAME} && ls -al ${ARTIFACT_DIR}/${BUILD_NAME}'

cd "${SERVICES_DIR}/${BUILD_TAG}"

echo "=== Running Build ==="

eval ${BUILD_COMMAND}
