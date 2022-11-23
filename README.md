# GR - Challenge

> This project contains 2 parts, api for backend and dashboard for frontend.

The api is using Nestjs as a framework provinding RESTful apis for creating, reading, updating and deleting scan result.

The dashboard is using Reactjs as a framework with Semantic UI and Tailwindcss for styling, it contains 2 tabs, Form and Results.

- Form is made for submitting scan result
- Results is made for displaying scan results and the detail of each one.

## Prerequisite

- docker
- docker-compose

## How to run

- create .env file contains these variables at root directory

```
DB_HOST= # database host eg. gr-dashboard
DB_PORT= # database port eg. 5432
DB_NAME= # database name eg. postgres
DB_USERNAME= # database user eg. postgres
DB_PASSWORD= # database password eg. @fSXDPk5!&2QG8xY
REACT_APP_API_URL= # api url eg. http://localhost:3333
```

- start up docker-compose

```
docker-compose up
```

- access dashboard via http://localhost:3000

## Unit Testing

Both api and dashboard has unit testing

### Prerequisite

- Nodejs (v16+)

API

```
    cd api
    npm install
    npm run test
```

Dashboard

```
    cd dashboard
    npm install
    npm run test
```
