package ensquery

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"testing"

	"github.com/joho/godotenv"
	"github.com/stretchr/testify/assert"
)

// Ensure that the Etherscan API is reachable and functional
func TestEtherscanUp(t *testing.T) {
	err := godotenv.Load("../.env")
	if err != nil {
		log.Fatalln("Failed to load required environment variables")
	}
	apiKey := os.Getenv("ETHERSCAN_API_KEY")
	ethUsdUrl := fmt.Sprintf("https://api.etherscan.io/api?module=stats&action=ethprice&apikey=%s", apiKey)
	convStruct := ethVal{}

	Resp, err := http.Get(ethUsdUrl)
	CheckErr(err)
	respBody, err := ioutil.ReadAll(Resp.Body)
	CheckErr(err)
	err = json.Unmarshal(respBody, &convStruct)
	CheckErr(err)

	convMessage := convStruct.Message
	if convMessage != "OK" {
		panic(fmt.Sprintf("Unexpected response: convStruct.Message == %s", convMessage))
	}
	assert.Equal(t, 200, Resp.StatusCode, "Etherscan API is up")
	assert.Equal(t, "OK", convMessage, "Etherscan API is functional")
}
