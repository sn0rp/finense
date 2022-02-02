package main

import (
	"fmt"
	"io/ioutil"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/joho/godotenv"
	"github.com/snorper/finense/ensquery"
	"github.com/stretchr/testify/assert"
)

// Testing for all potential endpoints
// We should only accept registered .eth domains

func TestEmpty(t *testing.T) {
	router := setupRouter()
	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/", nil)
	router.ServeHTTP(w, req)
	assert.Equal(t, 404, w.Code, "Root endpoint is not allowed")
	//assert.Equal(t, "pong", w.Body.String())
}

func TestBadAddress(t *testing.T) {
	router := setupRouter()
	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/snorp.dev", nil)
	router.ServeHTTP(w, req)
	assert.Equal(t, 400, w.Code, "Only .eth domain endpoints are allowed")
}

func TestGoodAddress(t *testing.T) {
	err := godotenv.Load()
	ensquery.CheckErr(err)
	router := setupRouter()
	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/brantly.eth", nil)
	router.ServeHTTP(w, req)

	brantlyAddress := "0x983110309620D911731Ac0932219af06091b6744"
	respBody, err := ioutil.ReadAll(w.Body)
	ensquery.CheckErr(err)
	bodyString := string(respBody)
	fmt.Println(bodyString)
	gotJson := strings.Contains(bodyString, brantlyAddress)

	assert.Equal(t, 200, w.Code, ".eth domain is properly handled by API")
	assert.Equal(t, true, gotJson, "Domain is properly resolved to address")
}

func TestUnregisteredAddress(t *testing.T) {
	err := godotenv.Load()
	ensquery.CheckErr(err)
	router := setupRouter()
	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/PleaseHireMeAndHopefullyNobodyRegistersThisRidiculousDomain.eth", nil)
	router.ServeHTTP(w, req)

	assert.Equal(t, 404, w.Code, "Endpoint must be registered .eth domain")
}
