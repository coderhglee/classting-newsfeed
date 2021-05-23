# Class Notice News Feeds

## Table of Contents

- [Overview](#overview)

- [Pre-Requisites](#pre-requisites)

- [Setup and Installation](#setup-and-installation)
  - [Installation](installation)
  - [Building](building)
- [Running Tests](running-tests)
- [Running Locally](running-locally)



## Overview



## Pre-Requisites

- [NodeJS](https://nodejs.org/en/) 12.x. It is recommended that you use [nvm](https://github.com/nvm-sh/nvm) to manage Node installations.
- Docker for building the Database (Mysql, Redis)
  - Install Docker Desktop for MAC: [https://docs.docker.com/docker-for-mac/install/](https://docs.docker.com/docker-for-mac/install/)
  -  Install Docker Desktop for Windows: [https://docs.docker.com/docker-for-windows/install/](https://docs.docker.com/docker-for-windows/install/)
  -  Install compose: [https://docs.docker.com/compose/install/](https://docs.docker.com/compose/install/)



## Setup and Installation

### Installation

Install the required npm packages with:

```bash
$ npm install
```

### Building

```bash
# Build once
$ npm run build

# Clean the dist folder
$ npm run prebuild
```

### Running Tests

Unit tests are written using the [Jest](https://jestjs.io/) framework. To run tests, execute:

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

### Running Locally

```bash
# create mysql, redis container for development environment
$ docker-compose up -d 

# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

