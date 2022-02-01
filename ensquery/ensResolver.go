package ensquery

import (
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"math"
	"net/http"
	"os"
	"strconv"

	"github.com/ethereum/go-ethereum/ethclient"
	"github.com/machinebox/graphql"
	ens "github.com/wealdtech/go-ens/v3"
)

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

func ENSInit(domain string) string {
	PID := os.Getenv("INFURA_PROJECT_ID")

	client, err := ethclient.Dial(fmt.Sprintf("https://mainnet.infura.io/v3/%s", PID))
	CheckErr(err)

	address, err := ens.Resolve(client, domain)
	CheckErr(err)

	// return all addresses with ENS records. This will be useful for future net worth calculation
	//coins := getAllCoinTypes(domain)
	//eth, usd := getEthBalance(address.Hex(), apiKey)

	//fmt.Printf("Address of %s is %s\n", domain, address.Hex())
	//fmt.Printf("Coins held: %v\n", coins)
	//fmt.Printf("%s holds %s ETH which equals %s USD\n", domain, eth, usd)

	return address.Hex()
}

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
		panic(balanceMessage)
	}

	convResp, err := http.Get(ethUsdUrl)
	CheckErr(err)
	convBody, err := ioutil.ReadAll(convResp.Body)
	CheckErr(err)
	err = json.Unmarshal(convBody, &convStruct)
	CheckErr(err)

	convMessage := convStruct.Message
	if convMessage != "OK" {
		panic(convMessage)
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

func getAllCoinTypes(domain string) []string {
	graphqlClient := graphql.NewClient("https://api.thegraph.com/subgraphs/name/ensdomains/ens")

	graphqlRequest := graphql.NewRequest(fmt.Sprintf(`
	{
	  domains(where:{name:"%s"}) {
	    resolver{
	      coinTypes
	    }
	  }
	}
	`, domain))

	type graphqlResponse struct {
		Domains []struct {
			Resolver struct {
				CoinTypes []string `json:"coinTypes"`
			} `json:"resolver"`
		} `json:"domains"`
	}

	var gqlResp graphqlResponse
	if err := graphqlClient.Run(context.Background(), graphqlRequest, &gqlResp); err != nil {
		panic(err)
	}
	coinTypes := gqlResp.Domains[0].Resolver.CoinTypes

	return coinTypes
}

/*
	We will eventually return values for all coin types supported by ENS.
	This will however take additional time due to differences in encoding.
	Commented here is the basis for a hypothetical "Return all coin types" function.

	name, err := ens.NewName(client, domain)
	if err != nil {
		panic(err)
	}
	for _, coin := range coins {
		thisCoinType, err := strconv.ParseUint(coin, 10, 64)
		if err != nil {
			panic(err)
		}
		thisAddress, err := name.Address(thisCoinType)
		if err != nil {
			panic(err)
		}

		// Convert to string and return address
	}
*/
