REPORTER ?= dot

all: test

lint:
	@./node_modules/.bin/jshint lib/

test: lint
	@./node_modules/.bin/mocha --reporter $(REPORTER)

.PHONY: lint test
