const puppeteer = require('puppeteer');
const selectors = require('./selectors');
const fs = require('fs');
const path = require('path');
const shelljs = require('shelljs');

const Operator = require('./models/Operator');
const Stat = require('./models/Stat');

const credentials = JSON.parse(fs.readFileSync(path.resolve(__dirname, './secrets.json')));
const getGeneralStats = require('./utils/getGeneralStats');
const getAttackers = require('./utils/getAttackers');
const getDefenders = require('./utils/getDefenders');

let counter = 0;

const fetchData = async () => {
  try {
    const browser = await puppeteer.launch({ args: ['--no-sandbox', "--proxy-server='direct://'", '--proxy-bypass-list=*'] });
    const page = await browser.newPage();
    await page.goto('https://game-rainbow6.ubi.com/en-gb/home',
      {
        waitUntil: ['networkidle2', "domcontentloaded", "load"]
      }
    );

    console.log('Browser started');

    // clicks the button to load the iframe
    await page.waitForSelector(selectors.pageLoginButton, { visible: true });
    await page.click(selectors.pageLoginButton);
    await page.waitForSelector(selectors.pageLoginIFrame, { visible: true });

    // check for the frame until it exists
    let frame;
    while (!frame) {
      await waitForFrame(page);
      frame = await page.frames()[2];
    }
    await frame.waitForNavigation({ waitUntil: 'networkidle2', timeout: 60000 });

    console.log('Login Frame loaded');

    // wait for the elements to spawn and insert data
    await Promise.all([
      frame.waitForSelector('#AuthEmail'),
      frame.waitForSelector('#AuthPassword'),
    ])
    await frame.type('#AuthEmail', credentials.email)
    await frame.type('#AuthPassword', credentials.password, { delay: 100 })

    // submits the form, clicks dont work apparently
    await frame.focus('#AuthPassword');
    await page.keyboard.type('\n');

    // wait for page transition to the stats websites overview page
    await frame.waitForNavigation({ timeout: 60000 });
    await page.waitForNavigation({ timeout: 60000 });

    console.log('logged in');

    // fetch the general stats
    const generalStats = await getGeneralStats(page); 

    // select the operator page (mobile view)
    await page.waitForSelector(selectors.pageDropdown);
    await page.select(selectors.pageDropdownOperator, selectors.pageDropdownOperatorSelect);

    console.log('fetching operators...')

    // check if the operators are fully loaded then get them and their stats
    await Promise.all([
      page.waitForSelector(selectors.defenders),
      page.waitForSelector(selectors.attackers),
    ])

    const defenders = await getDefenders(page);

    const attackers = await getAttackers(page);

    console.log('fetched data');

    // save all the data in mongodb
    await writeToDb({ generalStats, attackers, defenders });

    // save all the data into a json file
    writeFile({ generalStats, attackers, defenders });

    await browser.close();

    console.log('done');
    process.exit();
  } catch (e) {
    // limit to ~10 executions
    if (counter < 10) {
      console.log(e);
      // try again if it fails and probably fry my server
      fetchData();
      counter++;
    }
  }
};

function waitForFrame(page) {
  let fulfill;
  const promise = new Promise(x => fulfill = x);
  checkFrame();
  return promise;

  function checkFrame() {
    const frame = page.frames().find(f => f.name() === '');
    if (frame)
      fulfill(frame);
    else
      page.once('frameattached', checkFrame);
  }
}

function dateString() {
  const date = new Date();

  let year = date.getFullYear(),
    month = '' + (date.getMonth() + 1),
    day = '' + date.getDate(),
    hour = '' + date.getHours(),
    minute = '' + date.getMinutes(),
    seconds = '' + date.getSeconds();

  month.length < 2 ? month = '0' + month : month;
  day.length < 2 ? day = '0' + day : day;
  hour.length < 2 ? hour = '0' + hour : hour;
  minute.length < 2 ? minute = '0' + minute : minute;
  seconds.length < 2 ? seconds = '0' + seconds : seconds;


  return [[year, month, day,].join('-'), [hour, minute, seconds].join(':')].join('_');
}

function checkForDuplicates(fileName) {
  fs.readdirSync(path.resolve(__dirname, './data')).forEach(file => {
    if (fileName.split('_')[0] === file.split('_')[0]) {
      shelljs.mv('-f', path.resolve(__dirname, `./data/${file}`), path.resolve(__dirname, `./data/duplicates/${file}`));
    };
  });
}

function writeFile(stats) {
  const JSONdata = JSON.stringify(stats, null, 4);
  const fileName = `rainbow-stats-${dateString(JSONdata)}.json`;

  checkForDuplicates(fileName);
  fs.writeFileSync(path.resolve(__dirname, `./data/${fileName}`), JSONdata);
}

async function writeToDb({generalStats, attackers, defenders}) {
  const defendersDB = defenders.map((defender) => {
    const defenderOperator = new Operator(defender);
    defenderOperator.save(function (err) {
      if (err) {
        console.log(err);
        throw err;
      }
    });
    return defenderOperator._id;
  });

  const attackersDB = attackers.map((attacker) => {
    const attackerOperator = new Operator(attacker);
    attackerOperator.save(function (err) {
      if (err) {
        console.log(err);
        throw err;
      }
    });
    return attackerOperator._id;
  })

  const stats = new Stat({generalStats, attackers: attackersDB, defenders: defendersDB});
  await stats.save().then(console.log('added to db')).catch((err) => {
    if (err) {
      console.log(err);
      throw err;
    }
  });
}

module.exports = fetchData;