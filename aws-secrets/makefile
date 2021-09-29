SHELL := /bin/bash

name="junit-summary-slack-bot-user-oauth-access-token"
description="Junit Summary Slack API Access token"
RUN_AWS = @docker-compose run --rm --entrypoint bash aws_cli

publishSecret:
	$(eval value= $(shell buildkite-agent meta-data get "secret_value"))

	@echo "Processing secret $(name)"
	@$(RUN_AWS) process-secrets.sh -n "$(name)" -v "$(value)" -d "$(description)"

tidySecret:
	buildkite-agent meta-data set "secret_value" "value"

deleteSecret:
	@echo "Marking secret $(name) for deletion"
	@$(RUN_AWS) delete-secret.sh -n "$(name)"

getSecret:
	@$(RUN_AWS) get-secret.sh "$(name)"
