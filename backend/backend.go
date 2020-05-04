package main

import (
	"fmt"
	"net/http"
	"os"
)

func handleAPI(w http.ResponseWriter, r *http.Request) {
	fmt.Println(r.URL)
}

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "3000"
	}

	http.HandleFunc("/api/", handleAPI)
	http.Handle("/", http.FileServer(http.Dir("./static")))

	fmt.Println("Server is running on port: " + port)
	http.ListenAndServe(":"+port, nil)
}
