# CLOUD-AUTH

## What it is

Cloud Auth aims to provide a head start for applications that need to handle all user related stuff. Provides - signup, signin, signout, recover credentials, verify tokens, sessions etc. out of the box.

> MOTIVATION
> Any application today starts with a user signing in, signing out, signing up and stuff. This means it's a repetitive task and there should be a secure out-of-the box solution with minimal setup to ease up developer efforts!

## What it can do

- Signup a user
- Signout a user
- Maintain sessions
- Generate session tokens
- Verify session tokens
- Recover user credentials securely
- Maintain user profiles
- Pull out user profiles
- Create sub users (Maintain hierarchy of users)
- User Roles and permissions
- Create full user profiles using a simple json
- Update credentials

All this out of the box, on your own machine or in a hosted env - upto you!

## Integrate as a microservice or standalone REST service on your own infrastructure

Can be used as a microservice or a REST service and can integrate seamlessly with any backend.

> As a microservice, it can be spinned up in a existing network or can help starting something from scratch.

> As a standalone REST service, it can be hosted independently on any machine and can be interacted with using a REST API

## How to start

- Install docker on your machine
- Clone the repository and cd into it
- Run `docker-compose -f docker-compose.dev.yml up` (for production, remove dev for production setups)
- The API should be up on port 3000

## Under the bonnet!

Docker Containers, NodeJS, Express, MongoDB, Redis based sessions!

**Docker** : Docker containers are used for different underlying services

**NodeJS**: The primary environment

**Redis** : Primarily exists for taking care of sessions

**MongoDB**: The database for storing all user data

**ExpressJS**: This is for generating REST API and uses several middlewares like passport, helmet etc.

**PassportJS** Local and JWT stragtegies for now!
