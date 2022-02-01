package ensquery

import (
	"log"
	"strings"
)

func CheckErr(err error) {
	if err != nil {
		log.Fatalln("Generic error occurred")
	}
}

func IsENSDomain(domain string) bool {
	return strings.HasSuffix(domain, ".eth")
}
