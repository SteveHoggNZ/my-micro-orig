#!/bin/bash

set -e

S3_QUEUE_DIR="${PWD}/queue"

mkdir -p ${S3_QUEUE_DIR}

SERVICES_DIR='services'

buildSplit=(${BUILD_TAG//\// })
SERVICE=${buildSplit[0]}
VERSION=${buildSplit[1]}

cd "${SERVICES_DIR}/${SERVICE}"

COPY_COMMANDS='pwd && ls -al && mkdir -p ${S3_QUEUE_DIR}/${SERVICE}/ && zip -r ${S3_QUEUE_DIR}/${SERVICE}.zip .'

echo "=== Running Copy ==="

eval "${COPY_COMMANDS}"
