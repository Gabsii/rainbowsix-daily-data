const selectors = require('../selectors');

module.exports = async function getGeneralStats(page) {
  return {
    mmr: await page.$eval(selectors. generalMMR, el => el.textContent),
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
}