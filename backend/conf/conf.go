package conf

import "os"

var (
	DBUser     = os.Getenv("REMEMBRO_DB_USER")
	DBPassword = os.Getenv("REMEMBRO_DB_PASSWORD")
	DBName     = os.Getenv("REMEMBRO_DB_NAME")
	DBPort     = os.Getenv("REMEMBRO_DB_PORT")
	ServerPort = os.Getenv("REMEMBRO_SERVER_PORT")
)
