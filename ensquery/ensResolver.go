package ensquery

import (
	"context"
	"fmt"
	"os"

	"github.com/ethereum/go-ethereum/ethclient"
	"github.com/machinebox/graphql"
	ens "github.com/wealdtech/go-ens/v3"
)

func ENSInit(domain string) string {
	PID := os.Getenv("INFURA_PROJECT_ID")

	client, err := ethclient.Dial(fmt.Sprintf("https://mainnet.infura.io/v3/%s", PID))
	CheckErr(err)

	address, err := ens.Resolve(client, domain)
	if DomainExistsErr(err) {
		return "unregistered"
	}

	return address.Hex()
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
