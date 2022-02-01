package main

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/stretchr/testify/assert"
)

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
	req, _ := http.NewRequest("GET", "/snorp.com", nil)
	router.ServeHTTP(w, req)
	assert.Equal(t, 400, w.Code, "Only .eth domain endpoints are allowed")
}
