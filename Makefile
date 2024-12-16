install:
	npm ci

publish:
	npm publish --dry-run

lint: 
	npx eslint .

fix-lint:
	npx eslint --fix .

test:
	npm test
	
.PHONY: lint