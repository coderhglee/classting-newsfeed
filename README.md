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

이 저장소에는 학교 소식 뉴스피드 백엔드 API를 구현하였습니다.

- Framework
  - nestjs + typescript
- ORM
  - typeorm
- DB
  - Mysql, SQLite(Only Test)
  - Redis
- OAuth 2.0
  - Jwt

## Architecture

Twitter의 System Design을 참고하여 뉴스 피드 시스템을 설계하였습니다.

![High-Level-Solution-for-Twitter-System-Design](/Users/hakgyunlee/Downloads/High-Level-Solution-for-Twitter-System-Design.png)

관리자가 소식을 작성하면 해당 페이지를 구독중인 유저와 소식을 Cache Database에 비동기로 맵핑 하여 저장하고 뉴스 피드를 복잡한 쿼리 조회 과정을 거치지 않고 빠르게 사용자에게 제공하도록 설계하였습니다.

맵핑 데이터를 저장하기 위해 Cache Database를 사용한 이유는 만약 페이지를 구독중인 유저가 늘어났을때 insert를 처리하는 속도가 RDBMS 보다 Cache DB가 성능적으로 빠르고 그에 따른 부하를 줄이기 위해 Redis를 선택하엿습니다.

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
```

