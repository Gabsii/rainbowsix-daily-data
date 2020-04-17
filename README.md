# Tom Clancy's Rainbow Six Siege Daily Stat Tracker

Using this simple script you can generate a JSON file with your R6 stats.
Including general stats (kills, deaths, time played, ...) and operators specific stats.

## Requirements

- NodeJS v10+ 
- either npm or yarn
- a computer/server that allows for cron jobs (optional)
  - to run the script daily

## Setup 🐛

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

#### Setup on a Linux Server

If you run into any error messages when starting the script, make sure you have the following dependencies installed:

```
sudo apt-get install gconf-service libasound2 libatk1.0-0 libatk-bridge2.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget
```

After this running `npm run start` should work fine. Otherwise feel free to [open an issue](https://github.com/Gabsii/rainbowsix-daily-data/issues/new).