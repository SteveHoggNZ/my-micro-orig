#!/bin/bash

set -e

S3_QUEUE_DIR="${PWD}/queue"

mkdir -p ${S3_QUEUE_DIR}

SERVICES_DIR='services'

buildSplit=(${BUILD_TAG//\// })
SERVICE=${buildSplit[0]}
VERSION=${buildSplit[1]}

cd "${SERVICES_DIR}/${SERVICE}"

EXTRACT_COMMANDS='cp ../../.eslintrc . && mkdir -p ${S3_QUEUE_DIR}/${SERVICE}/ && zip -r ${S3_QUEUE_DIR}/${SERVICE}.zip .'

echo "=== Running Extract ==="

eval "${EXTRACT_COMMANDS}"
