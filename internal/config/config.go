package config

import (
	"fmt"
	"log"
	"os"

	_ "github.com/joho/godotenv/autoload" // read .env
)

func getEnv(s string) string {
	v, ok := os.LookupEnv(s)
	if !ok {
		log.Fatal("environment variable $" + s + " is not defined!")
	}
	fmt.Println(s, v)
	return v
}

var (
	PORT         = getEnv("PORT")
	DATABASE_URL = getEnv("DATABASE_URL")
)
