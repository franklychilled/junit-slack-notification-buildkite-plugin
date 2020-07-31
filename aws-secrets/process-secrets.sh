#!/bin/bash
set -euo pipefail

while getopts n:v:d: option
    do
    case "${option}"
    in
    n) KEY_NAME=${OPTARG};;
    v) VALUE=${OPTARG};;
    d) DESCRIPTION=${OPTARG};;
    *) echo "usage: $0 [-n] [-v] [-d]" >&2
       exit 1 ;;
    esac
done

function get_secret(){
    local name="${1}"

    echo "checking ${name} exists"

    count=$(aws secretsmanager list-secrets --query "SecretList[?Name=='${name}']" | jq '. | length')

    return $count
}

function create_secret(){
    local name="${1}"
    local value="${2}"
    local description="${3}"
    local key="${4}"

    echo "creating secret ${1} "

    aws secretsmanager create-secret --name "${name}" --description "${description}" --secret-string "${value}" --kms-key-id "${key}"
}

function update_secret(){
    local name="${1}"
    local value="${2}"
    local description="${3}"
    local key="${4}"

    echo "updating secret ${1} "

    aws secretsmanager update-secret --secret-id "${name}" --description "${description}" --secret-string "${value}" --kms-key-id "${key}"
}

KMS_ARN=$(aws kms describe-key --key-id "alias/aws/secretsmanager" --query 'KeyMetadata.KeyId' --output text)

if get_secret "${KEY_NAME}" -eq 0 ; then
    create_secret "${KEY_NAME}" "${VALUE}" "${DESCRIPTION}" "${KMS_ARN}"
else
    update_secret "${KEY_NAME}" "${VALUE}" "${DESCRIPTION}" "${KMS_ARN}"
fi
