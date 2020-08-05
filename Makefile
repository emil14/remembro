run-api:
	CompileDaemon --build="go build -o main cmd/api/main.go" --command=./main

run-web:
	npm start --prefix web

build-api:
	go build -o bin/api -v cmd/api/main.go

build-web:
	npm install --prefix web
	npm run build --prefix web

build-all:
	make build-api && make build-web
