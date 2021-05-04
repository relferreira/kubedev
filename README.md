<div align="center">
<img src="https://raw.githubusercontent.com/relferreira/kubedev/master/ui/assets/banner.png" width="100%" />
</div>

<hr />

Kubernetes Dashboard that helps developers in their everyday usage

![Docker Image CI](https://github.com/relferreira/kubedev/workflows/Docker%20Image%20CI/badge.svg)

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
docker run --rm -it -v ~/.kube/:/root/.kube/ --net=host relferreira/kubedev:2.0.0
```

or for macOS (port-forward functionality doesn't work this way):

```bash
docker run --rm -it -v ~/.kube/:/root/.kube/ -p 9898:9898 relferreira/kubedev:2.0.0
```

### Kubernetes Deploy

To install KubeDev in your kubernetes cluster, just apply the `deploy-in-cluster.yaml` file and you are ready to go:

```bash
kubectl apply -f deploy-in-cluster.yaml -n <NAMESPACE>
```

## Shortcuts

| Keys            | Shortcut           |
| --------------- | ------------------ |
| cmd + k         | Global Search      |
| cmd + shift + k | Command Pallete    |
| cmd + shift + y | Command History    |
| cmd + shift + f | Table Search       |
| g + n           | Namespace Selector |
| g + s           | Go to services     |
| g + d           | Go to deployments  |
| g + j           | Go to jobs         |
| g + c           | Go to cronjobs     |
| g + t           | Go to statefulsets |
| g + h           | Go to hpa          |
| g + v           | Go to pvc          |
| g + p           | Go to pods         |
| g + i           | Go to ingress      |
| g + m           | Go to configmaps   |
| g + r           | Go to secrets      |
| g + f           | Go to port-forward |

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
docker build -t relferreira/kubedev:1.0.0 .
docker push relferreira/kubedev:1.0.0
```

### Executable

```bash
go get -u github.com/gobuffalo/packr/packr
make
```
