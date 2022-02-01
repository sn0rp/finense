package main

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/snorper/finense/ensquery"
)

// Contains all data to be returned by the API
type ensUser struct {
	Domain string `json:"domain"`
	Addr   string `json:"addr"`
	Eth    string `json:"eth"`
	Usd    string `json:"usd"`
}

/*
We only need to handle GET requests for a given domain, as we do not want
users to directly interact with the Ethereum Mainnet under any circumstances.
The purpose of this API is simply to provide the amount of ETH owned and its
value in USD. This holds for all currencies and tokens which come to be
supported by Finense in the future.
*/
func getDomainInfo(c *gin.Context) {
	userDomain := c.Param("domain")
	if !ensquery.IsENSDomain(userDomain) {
		c.String(http.StatusBadRequest, "%s is not a .eth domain", userDomain)
		return
	}
	userAddr := ensquery.ENSInit(userDomain)
	if userAddr == "unregistered" {
		c.String(http.StatusNotFound, "%s is not a registered .eth domain", userDomain)
		return
	}
	if userAddr == "Unable to connect to Infura" {
		c.String(http.StatusBadGateway, "Unable to query API, please try again later")
		return
	}
	userEth, userUsd := ensquery.GetEthBalance(userAddr)
	user := ensUser{
		Domain: userDomain,
		Addr:   userAddr,
		Eth:    userEth,
		Usd:    userUsd,
	}
	c.IndentedJSON(http.StatusOK, user)
}

// We create the router outside of main() so that it can also be used for testing
func setupRouter() *gin.Engine {
	gin.SetMode(gin.ReleaseMode)
	r := gin.Default()
	r.GET("/:domain", getDomainInfo)
	return r
}

// Run server
func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatalln("Failed to load required environment variables")
	}
	r := setupRouter()
	r.Run(":8080") // for local deployment
	//log.Fatalln(autotls.Run(r, "example.com")) // for remote deployment
}
