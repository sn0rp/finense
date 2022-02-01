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

func getDomainInfo(c *gin.Context) {
	userDomain := c.Param("domain") // api.com/name.eth, pass into ens functions
	if !ensquery.IsENSDomain(userDomain) {
		c.String(http.StatusBadRequest, "%s is not a .eth domain", userDomain)
	} else {
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
	}

	//if err != nil {
	//	c.IndentedJSON(http.StatusNotFound, gin.H{"message":"not found"})
	//	return
	//}
}

func setupRouter() *gin.Engine {
	r := gin.Default()
	r.GET("/:domain", getDomainInfo)
	return r
}

func main() {
	err := godotenv.Load()
	ensquery.CheckErr(err)
	r := setupRouter()
	r.Run("localhost:8080")
}
