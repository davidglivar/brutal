REPORTER ?= dot

all: test

test: 
	@./node_modules/.bin/mocha --reporter $(REPORTER)

.PHONY: test
