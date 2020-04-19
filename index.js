const puppeteer = require('puppeteer');
const selectors = require('./selectors');
const fs = require('fs');
const path = require('path');
const shelljs = require('shelljs');

const credentials = JSON.parse(fs.readFileSync(path.resolve(__dirname, './secrets.json')));

const getData = async () => {
  try {
    const browser = await puppeteer.launch({ args: ['--no-sandbox', "--proxy-server='direct://'", '--proxy-bypass-list=*']});
    const page = await browser.newPage();
    await page.goto('https://game-rainbow6.ubi.com/en-gb/home', 
      {            
        waitUntil: ['networkidle2', "domcontentloaded", "load"]
      }
    );

    // clicks the button to load the iframe
    await page.waitForSelector('#home > div > div.rs-atom-transparent-arrow > div > div > div > div > div > div > button', {visible: true});
    await page.click('#home > div > div.rs-atom-transparent-arrow > div > div > div > div > div > div > button');
    await page.waitForSelector('body > div.rs-molecule-modal.ng-scope > div.rs-molecule-dialog > div > div > article > iframe', {visible: true});

    // check for the frame until it exists
    let frame; 
    while (!frame){
      await waitForFrame(page); 
      frame = await page.frames()[2];
    }
    await frame.waitForNavigation({waitUntil: 'networkidle2', timeout: 60000});

    // wait for the elements to spawn
    // and insert data
    await Promise.all([
      frame.waitForSelector('#AuthEmail'),
      frame.waitForSelector('#AuthPassword'),  
    ])
    await frame.type('#AuthEmail', credentials.email)
    await frame.type('#AuthPassword', credentials.password, {delay: 100})

    // submits the form, clicks dont work apparently
    await frame.focus('#AuthPassword');
    await page.keyboard.type('\n');

    // wait for page transition to the stats websites overview page
    await frame.waitForNavigation({timeout: 60000});
    await page.waitForNavigation({timeout: 60000});

    // fetch the general stats
    const generalStats = {
      totalGameTimeMultiplayer: await page.$eval(selectors.generalTotalGameTimeMultiplayer, el => el.textContent),
      totalGamesPlayedMultiplayer: await page.$eval(selectors.generalTotalGamesPlayedMultiplayer, el => el.textContent),
      wlRatioMultiplayer: await page.$eval(selectors.generalWlRatioMultiplayer, el => el.textContent),
      kdRatioMultiplayer: await page.$eval(selectors.generalKdRatioMultiplayer, el => el.textContent),
      assists: await page.$eval(selectors.generalAssists, el => el.textContent),
      revives: await page.$eval(selectors.generalRevives, el => el.textContent),
      headshots: await page.$eval(selectors.generalHeadshots, el => el.textContent),
      penetrationKills: await page.$eval(selectors.generalPenetrationKills, el => el.textContent),
      meeleeKills: await page.$eval(selectors.generalMeeleeKills, el => el.textContent),
      matchesWon: await page.$eval(selectors.generalMatchesWon, el => el.textContent),
      matchesLost: await page.$eval(selectors.generalMatchesLost, el => el.textContent),
      kills: await page.$eval(selectors.generalKills, el => el.textContent),
      deaths: await page.$eval(selectors.generalDeaths, el => el.textContent),
    }

    // select the operator page (mobile view)
    await page.waitForSelector('#section > div > div > div.ng-scope > div > div.player-statistics-tabs.ng-isolate-scope.rs-organism-tabs > nav > div > select');
    await page.select('#section > div > div > div.ng-scope > div > div.player-statistics-tabs.ng-isolate-scope.rs-organism-tabs > nav > div > select', 'number:2');

    // check if the operators are fully loaded 
    // then get them and their stats
    await Promise.all([
      page.waitForSelector(selectors.defenders),
      page.waitForSelector(selectors.attackers),
    ])

    const defenders = await page.$$eval(selectors.defenders, (articles, selectors) => {
      return articles.map((article) => {
        return {
          name: article.querySelector(selectors.operatorNameSelector).innerText,
          time: article.querySelector(selectors.operatorTimeSelector).innerText === '-' 
            ? null 
            : article.querySelector(selectors.operatorTimeSelector).innerText,
          winrate: article.querySelector(selectors.operatorWinrateSelector).innerText === '-' 
            ? null 
            : article.querySelector(selectors.operatorWinrateSelector).innerText,
          kd: article.querySelector(selectors.operatorKdSelector).innerText === '-' 
            ? null 
            : article.querySelector(selectors.operatorKdSelector).innerText,
          images: {
            badge: article.querySelector(selectors.operatorImgBadgeSelector).src,
            portrait: article.querySelector(selectors.operatorImgPortraitSelector).src,
          }
        }
    })}, selectors);

    const attackers = await page.$$eval(selectors.attackers, (articles, selectors) => {
      return articles.map((article) => {
        return {
          name: article.querySelector(selectors.operatorNameSelector).innerText,
          time: article.querySelector(selectors.operatorTimeSelector).innerText === '-' 
            ? null 
            : article.querySelector(selectors.operatorTimeSelector).innerText,
          winrate: article.querySelector(selectors.operatorWinrateSelector).innerText === '-' 
            ? null 
            : article.querySelector(selectors.operatorWinrateSelector).innerText,
          kd: article.querySelector(selectors.operatorKdSelector).innerText === '-' 
            ? null 
            : article.querySelector(selectors.operatorKdSelector).innerText,
          images: {
            badge: article.querySelector(selectors.operatorImgBadgeSelector).src,
            portrait: article.querySelector(selectors.operatorImgPortraitSelector).src,
          }
        }
    })}, selectors);

    // save all the data into a json file
    writeFile({generalStats, attackers, defenders})
    
    await browser.close();
  } catch(e) {
    console.log(e);
    // try again if it fails and probably fry my server
    getData();
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

function dateString(){
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

function writeFile( stats ){
  const JSONdata = JSON.stringify(stats, null, 4);
  const fileName = `rainbow-stats-${dateString(JSONdata)}.json`;

  checkForDuplicates(fileName);
  fs.writeFileSync(path.resolve(__dirname ,`data/${fileName}`), JSONdata);
}

function checkForDuplicates(fileName) {
  fs.readdirSync('./data').forEach(file => {
    if (fileName.split('_')[0] === file.split('_')[0]) {
      shelljs.mv('-f', path.resolve(__dirname, `data/${file}`), path.resolve(__dirname, `data/duplicates/${file}`));
    };
  });
}

getData();