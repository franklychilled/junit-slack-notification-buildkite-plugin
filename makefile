SHELL := /bin/bash
.SILENT:

BUILDKITE_BUILD_NUMBER ?= local
IMAGE_NAME ?= slack-notification

test: build run

build:
	echo building $(IMAGE_NAME):build-${BUILDKITE_BUILD_NUMBER}
	docker build --tag=$(IMAGE_NAME):build-${BUILDKITE_BUILD_NUMBER} .

run:
	docker-compose  -f ./docker-compose.yml up --abort-on-container-exit

clean:
	docker-compose down

prune:
	docker system prune -f
