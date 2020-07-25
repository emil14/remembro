run:
	CompileDaemon --build="go build -o main cmd/api/main.go" --command=./main
run-web:
	npm start --prefix web
build-web:
	npm run build --prefix web