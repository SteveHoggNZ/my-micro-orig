#!/bin/bash

SERVERLESS_FILE="serverless.yml"
RELEASE_FILE="release/release.yml"

service=$(grep "^service:" "${SERVERLESS_FILE}" | cut -d : -f 2 | sed 's/ //g')
ver=$(cat "${RELEASE_FILE}" | cut -d : -f 2 | sed 's/ //g')

echo "===================================="
echo "This script will increment the"
echo "version number then tag the release."
echo
echo "Please make sure you have committed"
echo "your changes before doing a release"
echo "===================================="

echo
echo "=== Service ${service} ==="
echo
echo "Current version: ${ver}"
echo

newVer="v$(echo ${ver} | sed 's/^v//' | perl -pe 's/^((\d+\.)*)(\d+)(.*)$/$1.($3+1).$4/e')"

setVer=""

while [[ "${setVer}" == "" ]]; do
  echo -n "Enter the new version number [$newVer]: "
  read userVer
  if [[ "${userVer}" == "" ]]; then
    setVer="${newVer}"
  else
    if [[ "${userVer}" =~ ^v[0-9]+\.[0-9]+ ]]; then
      setVer="${userVer}"
    else
      echo "Error: version must be in the format v[0-9]+.[0-9]+"
      echo
    fi
  fi
done

tag="${service}/${setVer}"
patchcmd="perl -pi -e 's/: '${ver}'/: '${setVer}'/' ${RELEASE_FILE}"
commitcmd="git add ${RELEASE_FILE}"
tagcmd="git tag ${tag}"

echo
echo "Tagging commit"
echo
echo "${patchcmd} && ${commitcmd} && ${tagcmd}"
echo

eval "${patchcmd} && ${commitcmd} && ${tagcmd}"

echo "The release has been tagged."
echo "To deploy, please push to origin with this command:"
echo
echo "git push origin ${tag}"
echo
