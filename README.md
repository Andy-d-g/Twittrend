# Requirements

- Twitter account
- Twitter API credentials
- Google Cloud account

# How it works

This app allow to monitor twitter trend about subject (keyword).

You have to setup on the server under `/server/src/config.ts`

Each day, the server will scrapp Twitter data about the subject, and make an sentimental analyze on it. Each tweet recover will have a score

It needs to be on to make works the cron job. It started to each midnight

You check the result, you have to launch the frontend and the backend. The frontend will call the backend to fetch scores and display it with graphics.

# Setup Twitter

Create an account : https://twitter.com/i/flow/signup

Create your api key : https://developer.twitter.com/en/docs/twitter-api/getting-started/getting-access-to-the-twitter-api

# Setup Google Cloud Platform

> GCP > Create Project > `${projectName}`

> GCP > IAM > Service account > Create a service account `${serviceAccountName}`

> GCP > IAM > Service account > `${serviceAccountName}` > Key > Create key 

> Save download key into `server` folder as `googleKeys.json`

# Setup infra

`infra/provider.ts` : define project value to `${projectName}`

```sh
# Move to infra directory
$ cd infra 

# Init infrastucture project
$ terraform init

# Deploy infrastructure
$ terraform apply -auto-approve 
```

# Setup front

```sh
# Move to client directory
$ cd client 

# Install deps
$ (yarn | npm) install

# Launch (hot reload)
$ npm run dev
```

# Setup server

```sh
# Move to server directory
$ cd server 

# Install deps
$ (yarn | npm) install

# Transform and fill `env.template` to `.env` file 

# Launch (hot reload)
$ npm run dev
```

# Create database credentials 

> GCP > SQL > mydatabaseinstance > users > Add user 

# Setup your adresse ip to access database

> GCP > SQL > mydatabaseinstance > networks > add network > `${your ip}` > Save