<p align="center">
    :construction: Work in Progress! :construction:
</p>

![alt text](https://raw.githubusercontent.com/relferreira/kubedev/master/ui/assets/kubedev-logo.png)

Kubernetes Dashboard that helps developers in their everyday usage

## Installation

Download the binary files in the relase page

## Development

### Server

Install dependencies

```
glide up
```

Run Server

```
go run main.go
```

### UI

Install dependencies

```
yarn
```

Run app

```
yarn start
```

## Packaging

Package UI

```
yarn build
```

Package Server

```
go get -u github.com/gobuffalo/packr/packr
make build
```
