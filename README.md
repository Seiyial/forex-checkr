# Forex Checkr

 Design a Node web app with a simple one page frontend

## Usage

1. Install Dependencies

   ```bash
   $ git clone https://github.com/seiyial/interview-node.git
   $ yarn
   ```

2. Duplicate `.env.example` into `.env` and insert the required values.

3. Create and migrate database.

   ````bash
   $ psql # use same Role as specified in .env, OR just use 'postgres' user for both
   psql> DROP DATABASE forex_checkr;
   psql> CREATE DATABASE forex_checkr;
   psql> \q
   $ yarn run db:migrate
   ````

4. Start the server.

   ```bash
   $ yarn start
   
   # or use separate tabs for server and client
   #   Tab 1
   $ yarn run server
   #   Tab 2
   $ yarn run client
   ```

