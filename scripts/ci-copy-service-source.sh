#!/bin/bash

set -x

S3_SRC_DIR="${PWD}/src"

mkdir -p ${S3_SRC_DIR}

SERVICES_DIR='services'

buildSplit=(${BUILD_TAG//\// })
SERVICE=${buildSplit[0]}
VERSION=${buildSplit[1]}

COPY_COMMANDS='mkdir -p ${S3_SRC_DIR}/${SERVICE}/ && cp -R . ${S3_SRC_DIR}/${SERVICE}/${VERSION}'

cd "${SERVICES_DIR}/${SERVICE}"

echo "=== Running Copy ==="

eval "${COPY_COMMANDS}"
