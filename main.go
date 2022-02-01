package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/snorper/finense/ensquery"
)

type ensUser struct {
	Domain string `json:"domain"`
	Addr   string `json:"addr"`
	Eth    string `json:"eth"`
	Usd    string `json:"usd"`
}

//var user = ensUser{
//	Name: "brantly.eth", Addr: "0x69420", Eth: "5", Usd: "15000",
//}

func getUsers(c *gin.Context) {
	userDomain := c.Param("domain") // api.com/name.eth, pass into ens functions
	userAddr := ensquery.ENSInit(userDomain)
	userEth, userUsd := ensquery.GetEthBalance(userAddr)

	user := ensUser{
		Domain: userDomain,
		Addr:   userAddr,
		Eth:    userEth,
		Usd:    userUsd,
	}
	//c.String(http.StatusOK, "Hello %s", ensDomain)
	c.IndentedJSON(http.StatusOK, user)

	//if err != nil {
	//	c.IndentedJSON(http.StatusNotFound, gin.H{"message":"not found"})
	//	return
	//}
}

func main() {
	err := godotenv.Load()
	ensquery.CheckErr(err)
	router := gin.Default()
	router.GET("/:domain", getUsers)
	router.GET("/users", getUsers)
	router.Run("localhost:8080")
}
