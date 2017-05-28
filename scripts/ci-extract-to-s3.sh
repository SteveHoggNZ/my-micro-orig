#!/bin/bash

set -e

S3_QUEUE_DIR="${PWD}/queue"

mkdir -p ${S3_QUEUE_DIR}

SERVICES_DIR='services'

buildSplit=(${BUILD_TAG//\// })
SERVICE=${buildSplit[0]}
VERSION=${buildSplit[1]}

cd "${SERVICES_DIR}/${SERVICE}"

CHECK_SERVICE=$(node -p "require('./package.json').name")
CHECK_VERSION=$(node -p "require('./package.json').version")

if [[ "${SERVICE}" != "${CHECK_SERVICE}" ]]; then
  echo "Package service ${CHECK_SERVICE} does not match tag service ${SERVICE}"
  exit 2
fi

if [[ "${VERSION}" != "${CHECK_VERSION}" ]]; then
  echo "Package version ${CHECK_VERSION} does not match tag version ${VERSION}"
  exit 2
fi

COPY_COMMANDS='cp ../../.eslintrc . && cp ../../project.yml . && cp -R ../../piplines .'
EXTRACT_COMMANDS='${COPY_COMMANDS} && mkdir -p ${S3_QUEUE_DIR}/${SERVICE}/ && zip -r ${S3_QUEUE_DIR}/${SERVICE}.zip .'

echo "=== Running Extract ==="

eval "${EXTRACT_COMMANDS}"
