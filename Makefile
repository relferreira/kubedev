# Go parameters
GOCMD=go
PACKRCMD=packr
GOBUILD=$(PACKRCMD) build
GOCLEAN=$(GOCMD) clean
GOTEST=$(GOCMD) test
GOGET=$(GOCMD) get
BINARY_NAME=kubedev
BINARY_MAC=$(BINARY_NAME)_darwin
BINARY_UNIX=$(BINARY_NAME)_unix

all: test build
build: 
	$(GOBUILD) -o $(BINARY_NAME) -v
test: 
	$(GOTEST) -v ./...
clean: 
	$(GOCLEAN)
	rm -f $(BINARY_NAME)
	rm -f $(BINARY_UNIX)
# Cross compilation
build:
	cd ui && yarn build
	GOOS=darwin GOARCH=amd64 $(GOBUILD) -o $(BINARY_MAC) -v
	CGO_ENABLED=0 GOOS=linux GOARCH=amd64 $(GOBUILD) -o $(BINARY_UNIX) -v