# Express API in Docker

## Prerequisites

- [Docker](https://www.docker.com/)
  Docker must be installed, and the docker daemon should be running.

## Setup

Run the following command in a shell of your choice.
Note: NPM dependencies might take some time to install.

```console
$ docker build -t "express-server" .
```

## Run the server

```console
$ docker run -p 8000:8000 -it express-server
```

The port for the server is 8000 and currently not configured by an ENV variable, so be sure to leave it as is.

## Testing

The test suite is run at build time!
