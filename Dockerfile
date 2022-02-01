FROM golang:1.17.6-alpine

RUN mkdir /finense

COPY . /finense

WORKDIR /finense

RUN apk add build-base

RUN go build -o finense .

EXPOSE 8080

CMD ["/finense/finense"]