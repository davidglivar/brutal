REPORTER ?= dot
WATCH_REPORTER ?= min

all: test

lint:
	@./node_modules/.bin/jshint lib/

test: lint
	@./node_modules/.bin/mocha --reporter $(REPORTER)

watch-test: lint
	@./node_modules/.bin/mocha --reporter $(WATCH_REPORTER) --watch


.PHONY: lint test watch-test
