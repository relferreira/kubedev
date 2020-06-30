FROM node:11.14 as ui-builder

ENV NODE_ENVIRONMENT=production
ENV API=/api

COPY ui /kubedev/ui
WORKDIR /kubedev/ui

RUN yarn
RUN yarn build

FROM golang:1.13 as builder

COPY . /kubedev
COPY --from=ui-builder /kubedev/dist /kubedev/dist
WORKDIR /kubedev
RUN go get -u github.com/gobuffalo/packr/packr
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 packr build -o kubedev -v

FROM alpine:latest

ENV KUBEDEV_ENV=docker

RUN apk add curl && \
    curl -LO https://storage.googleapis.com/kubernetes-release/release/v1.17.0/bin/linux/amd64/kubectl
RUN chmod +x kubectl
RUN mv kubectl /bin/

WORKDIR /root/

COPY --from=builder /kubedev/kubedev .
COPY --from=ui-builder /kubedev/dist dist

CMD ["./kubedev"]