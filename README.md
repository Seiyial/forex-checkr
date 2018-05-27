# Node Web App

 Design a Node web app with a simple one page frontend

## Goal

I want to track some forex rates. Typical use cases:
- Fetch currency rates
- Set forex levels on selected pairs
- Update set forex levels
- Alert when level reaches mark
- Delete set levels

## Setup

- Install dependencies `yarn`
- Duplicate `.env.example` into `.env` and insert the required values.
- Make sure you have a database called `forex_checkr` created under the same user specified in your `.env` file.
- Launch server `yarn start`


## Development

- Given the bootstrapped node server (index.js), create endpoints for **C**reating, **R**eading, **U**pdating and **D**eleting
- Use a **local database** to store forex level objects
- **Simple interface** to set, update, delete forex levels

## Boundaries

- No user authentication
- Limit to 5 set forex levels
- Node version 8.9.0 or higher
- Commit to **(Insert your name)** branch

## Resource

- Use [Fixer API](http://fixer.io/) to fetch Forex rates
