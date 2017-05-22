#!/bin/bash

# function join_by { local d=$1; shift; echo -n "$1"; shift; printf "%s" "${@/#/$d}"; }

ARTIFACT_DIR="${PWD}/artifacts"

mkdir -p ${ARTIFACT_DIR}

SERVICES_DIR='services'

buildSplit=(${BUILD_TAG//\// })
SERVICE=${buildSplit[0]}
VERSION=${buildSplit[1]}

# COMMANDS=('cd ${SERVICES_DIR}/${SERVICE}'
#   'npm i'
#   'npm run build'
#   'cp .serverless/* ${ARTIFACT_DIR}/${SERVICE}/${VERSION}')

BUILD_COMMANDS='npm i && npm run build && cp .serverless/* ${ARTIFACT_DIR}/${SERVICE}/${VERSION}'

cd "${SERVICES_DIR}/${SERVICE}"

echo "=== Running Build ==="

# # eval $(join_by ' && ' ${COMMANDS[@]})
eval "${BUILD_COMMANDS}"
