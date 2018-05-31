# Forex Checkr

 Design a Node web app with a simple one page frontend

## Usage

1. Install Dependencies

   ```bash
   $ git clone https://github.com/seiyial/forex-checkr.git
   $ cd forex-checkr
   $ git checkout sayhao
   $ yarn
   ```

2. Duplicate `.env.example` into `.env` and modify it to include the required values (namely the `FIXER_API_ACCESS_KEY`.)

3. Create and migrate database.

   ````bash
   $ psql # use the same Role specified in .env, OR simply use 'postgres' user for both
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



## Usage Notes

1. To add a Forex Level, Search for a valid Forex rate, set the Upper and Lower limit you desire, and Save.
2. Upper and Lower limits must be higher and lower (respectively) than the current forex rate displayed. Otherwise, an error will be displayed and the Level will not be saved.
3. If you already have 5 Forex levels, you won't be able to add more either.
4. Once saved, click 'Edit' and 'Delete' to change or delete the records accordingly.
5. No validations were put in place for edited values of upper and lower limit. This was done on purpose so that you may test the notification that occurs should the rate hit either the upper or lower limits. You can do so by purposely changing the lower limit to be above the current rate, or the upper limit to be below the current rate.
6. Enjoy!