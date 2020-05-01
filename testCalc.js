const fs = require('fs');
const path = require('path');
const data = JSON.parse(fs.readFileSync(path.resolve(__dirname, './teststats.json')));

data.defenders.forEach(defender => {
  if(defender.time) {
    const time = defender.time.split('h');
    const hours = parseInt(time[0]);
    const minutes = parseFloat(time[1].replace('m','') / 60);
    const mathTime = hours + minutes;
    
    console.log({
      name: defender.name,
      kdrate: defender.winrate * defender.kd,
      time: mathTime,
      kdPerTime: (defender.winrate * defender.kd)/mathTime,
    })
  }
})