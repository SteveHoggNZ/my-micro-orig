#!/bin/bash

set -e

ENVIRONMENT="prod"
STACK_NAME="my-micro-${ENVIRONMENT}"

run_title() {
  echo "======== "$1" ========"
}

run_deploy() {
  run_title "Deploying Infrastructure"
  cmd="aws cloudformation"

  if [[ "$(aws cloudformation list-stacks --query 'StackSummaries[?StackName==`'${STACK_NAME}'`]')" == "[]" ]]; then
    cmd="${cmd} create-stack"
  else
    cmd="${cmd} update-stack"
  fi

  cmd="${cmd} --stack-name ${STACK_NAME} --template-body file://ci-cd.cf.yml --parameters ParameterKey=EnvironmentParameter,ParameterValue=${ENVIRONMENT} --capabilities CAPABILITY_IAM"

  set -x
  eval "$cmd"
  set +x
}

if [[ "$1" == "deploy" ]]; then
  run_deploy
else
  echo "Usage: "$0" deploy"
fi
