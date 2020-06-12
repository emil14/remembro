package conf

import (
	"fmt"
	"log"
	"os"
)

var (
	DBUser     = getEnv("REMEMBRO_DB_USER")
	DBPassword = getEnv("REMEMBRO_DB_PASSWORD")
	DBName     = getEnv("REMEMBRO_DB_NAME")
	DBPort     = getEnv("REMEMBRO_DB_PORT")
	ServerPort = getEnv("REMEMBRO_SERVER_PORT")
)

func getEnv(s string) string {
	v, ok := os.LookupEnv(s)
	if !ok {
		log.Fatal("s% environment variable is not defined!")
	}
	fmt.Println(s, v)
	return v
}
