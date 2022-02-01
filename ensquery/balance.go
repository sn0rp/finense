package ensquery

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"math"
	"net/http"
	"os"
	"strconv"
)

// These contain data to be returned by the Etherscan API
type ethBalance struct {
	Status  string `json:"status"`
	Message string `json:"message"`
	Result  string `json:"result"`
}

type ethConv struct {
	Ethbtc           string `json:"ethbtc"`
	Ethbtc_timestap  string `json:"ethbtc_timestamp"`
	Ethusd           string `json:"ethusd"`
	Ethusd_timestamp string `json:"ethusd_timestamp"`
}

type ethVal struct {
	Status  string  `json:"status"`
	Message string  `json:"message"`
	Result  ethConv `json:"result"`
}

/*
We use the Etherscan API to return the balance of an address in ETH and USD.
The Ethplorer API is of interest (among other tools) in the future as support
for ERC-20 tokens is under consideration.
*/
func GetEthBalance(address string) (string, string) {
	apiKey := os.Getenv("ETHERSCAN_API_KEY")
	balanceUrl := fmt.Sprintf("https://api.etherscan.io/api?module=account&action=balance&address=%s&tag=latest&apikey=%s", address, apiKey)
	ethUsdUrl := fmt.Sprintf("https://api.etherscan.io/api?module=stats&action=ethprice&apikey=%s", apiKey)
	balanceStruct := ethBalance{}
	convStruct := ethVal{}

	balResp, err := http.Get(balanceUrl)
	CheckErr(err)
	balBody, err := ioutil.ReadAll(balResp.Body)
	CheckErr(err)
	err = json.Unmarshal(balBody, &balanceStruct)
	CheckErr(err)

	balanceMessage := balanceStruct.Message
	if balanceMessage != "OK" {
		panic(fmt.Sprintf("Unexpected response: balanceStruct.Message == %s", balanceMessage))
	}

	convResp, err := http.Get(ethUsdUrl)
	CheckErr(err)
	convBody, err := ioutil.ReadAll(convResp.Body)
	CheckErr(err)
	err = json.Unmarshal(convBody, &convStruct)
	CheckErr(err)

	convMessage := convStruct.Message
	if convMessage != "OK" {
		panic(fmt.Sprintf("Unexpected response: convStruct.Message == %s", convMessage))
	}

	balance, err := strconv.Atoi(balanceStruct.Result)
	CheckErr(err)
	ethFloat := float64(balance) / math.Pow(10, 18)

	ethUsd, err := strconv.ParseFloat(convStruct.Result.Ethusd, 64)
	CheckErr(err)
	usdFloat := ethFloat * ethUsd

	eth := fmt.Sprintf("%f", ethFloat)
	usd := fmt.Sprintf("%f", usdFloat)

	return eth, usd

}
