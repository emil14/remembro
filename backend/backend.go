package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
)

func indexHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Println(r.URL)
}

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "3000"
	}

	http.HandleFunc("/api", indexHandler)

	fmt.Println("Server is running on port: " + port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}
