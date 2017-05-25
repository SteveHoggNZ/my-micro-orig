#!/bin/bash

set -x

S3_QUEUE_DIR="${PWD}/queue"

mkdir -p ${S3_QUEUE_DIR}

SERVICES_DIR='services'

buildSplit=(${BUILD_TAG//\// })
SERVICE=${buildSplit[0]}
VERSION=${buildSplit[1]}

cd "${SERVICES_DIR}/${SERVICE}"

COPY_COMMANDS='mkdir -p ${S3_QUEUE_DIR}/${SERVICE}/ && cp -R . ${S3_QUEUE_DIR}/${SERVICE}/${VERSION}'

echo "=== Running Copy ==="

eval "${COPY_COMMANDS}"