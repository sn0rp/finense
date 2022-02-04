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
	req, _ := http.NewRequest("GET", "/vitalik.eth", nil)
	router.ServeHTTP(w, req)

	vitalikAddress := "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"
	respBody, err := ioutil.ReadAll(w.Body)
	ensquery.CheckErr(err)
	bodyString := string(respBody)
	fmt.Println(bodyString)
	gotJson := strings.Contains(bodyString, vitalikAddress)

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
