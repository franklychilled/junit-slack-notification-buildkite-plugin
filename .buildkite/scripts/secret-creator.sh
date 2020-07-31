#!/bin/bash
set -eu

# You may need to run to allows Buildkite to run this scripts
# git update-index --chmod=+x ".buildkite/scripts/secret-creator.sh"
# git update-index --chmod=+x ".buildkite/scripts/publish-secret.sh"
# git update-index --chmod=+x ".buildkite/scripts/tidy-secret.sh"

AWS_CLI=$(buildkite-agent meta-data get "aws-cli")
BUILDKITE_QUEUE=$(buildkite-agent meta-data get "buildkite-queue")

echo "
  - label: \"Saving secret using ${BUILDKITE_QUEUE}\"
    command: .buildkite/scripts/publish-secret.sh
    timeout_in_minutes: 10
    env:
      AWS_CLI: ${AWS_CLI}
    agents:
      queue: ${BUILDKITE_QUEUE}
  - wait
  - label: \"Tidying Up\"
    command: .buildkite/scripts/tidy-secret.sh
    timeout_in_minutes: 10
" | buildkite-agent pipeline upload