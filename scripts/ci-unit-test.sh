#!/bin/bash

set -e

SERVICES_DIR='services'

buildSplit=(${BUILD_TAG//\// })
SERVICE=${buildSplit[0]}
VERSION=${buildSplit[1]}

cd "${SERVICES_DIR}/${SERVICE}"

UNIT_TEST_COMMANDS='pwd && ls -al && npm i && npm run test'

echo "=== Running Tests ==="

eval "${UNIT_TEST_COMMANDS}"
