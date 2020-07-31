#!/bin/bash
set -euo pipefail

while getopts n: option
    do
    case "${option}"
    in
    n) NAME=${OPTARG};;
    *) echo "usage: $0 [-n]" >&2
       exit 1 ;;
    esac
done

function get_secret(){
    local name="${1}"

    echo "checking ${name} exists"

    count=$(aws secretsmanager list-secrets --query "SecretList[?Name=='${name}']" | jq '. | length')

    return $count
}


# get secret to check it exists
if get_secret "${NAME}" -eq 0 ; then
    echo "Secret not found, cannot delete secret ${NAME}"
else
    echo "Requesting deletion of secret ${NAME}"
    aws secretsmanager delete-secret --secret-id "${NAME}" --recovery-window-in-days 30
    echo "${NAME} as been marked for deletion after a recovery period of 30 days."
fi
