package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/emil14/remembro/conf"
	"github.com/emil14/remembro/db"
)

func indexHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Println(r.URL)
}

func main() {
	db.InitDb()

	http.HandleFunc("/api", indexHandler)
	fmt.Println("Server is running on port: " + conf.ServerPort)
	log.Fatal(http.ListenAndServe(":"+conf.ServerPort, nil))
}
