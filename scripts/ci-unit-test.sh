#!/bin/bash

SERVICES_DIR='services'

buildSplit=(${BUILD_TAG//\// })
SERVICE=${buildSplit[0]}
VERSION=${buildSplit[1]}

UNIT_TEST_COMMANDS='npm i && npm run test'

cd "${SERVICES_DIR}/${SERVICE}"

echo "=== Running Tests ==="

eval "${UNIT_TEST_COMMANDS}"
