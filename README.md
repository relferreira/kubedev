<p align="center">
    :construction: Work in Progress! :construction:
</p>

<div align="center">
<img src="https://raw.githubusercontent.com/relferreira/kubedev/master/ui/assets/kubedev-logo.png" />
</div>
Kubernetes Dashboard that helps developers in their everyday usage

## Installation

### Executable

Download the binary files in the [release page](https://github.com/relferreira/kubedev/releases)

Then run:

```bash
./kubedev_darwin
OR
./kubedev_unix
```

This method requires that you have `kubectl` installed and configured

### Docker

```bash
docker run --rm -it -v ~/.kube/:/root/.kube/ -p 9898:9898 relferreira/kubedev:0.0.22
```

## Development

### Server

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

### Docker

```bash
docker build -f deploy/Dockerfile -t relferreira/kubedev:0.0.22 .
docker push relferreira/kubedev:0.0.22
```

### Executable

```bash
go get -u github.com/gobuffalo/packr/packr
make
```
