package ensquery

import "log"

func CheckErr(err error) {
	if err != nil {
		log.Fatalln("Generic error occurred")
	}
}
