REPORTER ?= dot

all: test

lint:
	@./node_modules/.bin/jshint lib/

test: lint
	@./node_modules/.bin/mocha --reporter $(REPORTER)

watch-test:
	@./node_modules/.bin/mocha --reporter min --watch


.PHONY: lint test watch-test
