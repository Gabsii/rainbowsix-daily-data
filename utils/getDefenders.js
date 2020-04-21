const selectors = require('../selectors');

module.exports = async function getDefenders(page) {
  return await page.$$eval(selectors.defenders, (articles, selectors) => {
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
        },
        type: 'defender'
      };
    })
  }, selectors);
}