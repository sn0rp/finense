package ensquery

import (
	"log"
	"strings"
)

func CheckErr(err error) {
	if err != nil {
		panic(err)
	}
}

func DomainExistsErr(err error) bool {
	if err != nil {
		if err.Error() == "unregistered name" {
			return true
		}
		log.Fatalln(err) // This should never happen
	}
	return false
}

func IsENSDomain(domain string) bool {
	return strings.HasSuffix(domain, ".eth")
}
