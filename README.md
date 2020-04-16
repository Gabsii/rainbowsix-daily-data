# Tom Clancy's Rainbow Six Siege Daily Stat Tracker

Using this simple script you can generate a JSON file with your R6 stats.
Including general stats (kills, deaths, time played, ...) and operators specific stats.

## Requirements

- NodeJS v10+ 
- either npm or yarn
- a computer/server that allows for cron jobs (optional)
  - to run the script daily

## Setup 

Clone this repository and install the dependencies:

```
yarn

// or

npm install
```

Copy the `secrets_example.json` to `secrets.json` and fill out your ubisoft account data.

```
cp secrets_example.json secrets.json
```

After setting your credentials you can start the script using:

```
yarn start

// or 

npm run start
```