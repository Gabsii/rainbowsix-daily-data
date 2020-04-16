const puppeteer = require('puppeteer');
const selectors = require('./selectors');
const fs = require('fs');

const credentials = JSON.parse(fs.readFileSync('secrets.json'));

(async () => {
  const browser = await puppeteer.launch({ args: ["--proxy-server='direct://'", '--proxy-bypass-list=*']});
  const page = await browser.newPage();
  await page.goto('https://game-rainbow6.ubi.com/en-gb/home', 
    {            
      waitUntil: ['networkidle2', "domcontentloaded", "load"]
    }
  );

  await page.waitForSelector('#home > div > div.rs-atom-transparent-arrow > div > div > div > div > div > div > button', {visible: true});
  await page.click('#home > div > div.rs-atom-transparent-arrow > div > div > div > div > div > div > button');
  console.log("click");
  await page.waitForSelector('body > div.rs-molecule-modal.ng-scope > div.rs-molecule-dialog > div > div > article > iframe', {visible: true});

  let frame; 
  while (!frame){
    await waitForFrame(page); 
    frame = await page.frames()[2];
  }

  console.log("frame loaded");
  await frame.waitForNavigation({waitUntil: 'networkidle2', timeout: 60000});

  console.log("page loaded");

  await Promise.all([
    frame.waitForSelector('#AuthEmail'),
    frame.waitForSelector('#AuthPassword'),  
  ])

  console.log("selectors exist");

  await frame.type('#AuthEmail', credentials.email)
  await frame.type('#AuthPassword', credentials.password, {delay: 100})

  console.log("input done");

  // submits the form, clicks dont work apparently
  await frame.focus('#AuthPassword');
  await page.keyboard.type('\n');

  console.log("submit");

  await frame.waitForNavigation({timeout: 60000});

  console.log("frame done loading");

  await page.waitForNavigation({timeout: 60000});

  console.log("page done transitioning");

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

  console.log('got generalStats --> go to operators page');

  await page.waitForSelector('#section > div > div > div.ng-scope > div > div.player-statistics-tabs.ng-isolate-scope.rs-organism-tabs > nav > div > select');
  await page.select('#section > div > div > div.ng-scope > div > div.player-statistics-tabs.ng-isolate-scope.rs-organism-tabs > nav > div > select', 'number:2');

  console.log('switched to ops page');

  await Promise.all([
    page.waitForSelector(selectors.defenders),
    page.waitForSelector(selectors.attackers),
  ])

  const defenders = await page.$$eval(selectors.defenders, (articles, selectors) => {
    return articles.map((article) => {
      return {
        name: article.querySelector(selectors.operatorNameSelector).innerText,
        time: article.querySelector(selectors.operatorTimeSelector).innerText,
        winrate: article.querySelector(selectors.operatorWinrateSelector).innerText,
        kd: article.querySelector(selectors.operatorKdSelector).innerText,
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
        time: article.querySelector(selectors.operatorTimeSelector).innerText,
        winrate: article.querySelector(selectors.operatorWinrateSelector).innerText,
        kd: article.querySelector(selectors.operatorKdSelector).innerText,
        images: {
          badge: article.querySelector(selectors.operatorImgBadgeSelector).src,
          portrait: article.querySelector(selectors.operatorImgPortraitSelector).src,
        }
      }
  })}, selectors);

  fs.writeFileSync(`rainbow-stats-${dateString()}.json`, JSON.stringify({generalStats, attackers, defenders}, null, 4));

  await browser.close();
})();

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