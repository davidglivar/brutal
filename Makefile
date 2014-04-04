REPORTER ?= dot
WATCH_REPORTER ?= min

all: test

lint:
	@NODE_ENV=test ./node_modules/.bin/jshint lib/

test: lint
	@NODE_ENV=test ./node_modules/.bin/mocha --reporter $(REPORTER)

test-w: lint
	@./node_modules/.bin/mocha --reporter $(WATCH_REPORTER) --watch

test-cov:
	@jscoverage --no-highlight lib lib-cov
	@BRUTAL_COV=1 ./node_modules/.bin/mocha --reporter html-cov > coverage.html

.PHONY: lint test test-w
