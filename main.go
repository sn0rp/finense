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
	userEth, userUsd := ensquery.GetEthBalance(userAddr)
	user := ensUser{
		Domain: userDomain,
		Addr:   userAddr,
		Eth:    userEth,
		Usd:    userUsd,
	}
	c.IndentedJSON(http.StatusOK, user)
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
