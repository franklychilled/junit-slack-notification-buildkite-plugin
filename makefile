SHELL := /bin/bash
.SILENT:

IMAGE_NAME ?= slack-notification
TAG ?= local

test: build run_tests

build:
	echo building $(IMAGE_NAME):$(TAG)
	docker build --tag=$(IMAGE_NAME):$(TAG) .

run:
	docker-compose  -f ./docker-compose.yml up --abort-on-container-exit

clean:
	docker-compose down

prune:
	docker system prune -f
