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

func DomainExistsErr(err error) bool {
	if err != nil {
		if err.Error() == "unregistered name" {
			return true
		}
		log.Fatalln(err)
	}
	return false
}

func IsENSDomain(domain string) bool {
	return strings.HasSuffix(domain, ".eth")
}
