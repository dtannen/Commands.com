var request = require('request');
const baseUrl = 'https://finance.yahoo.com/quote/';

module.exports = {
  getCurrentPrice: getCurrentPrice
};

function getCurrentPrice(tickers) {
  const dataPromise = tickers.map((ticker) => {
    return new Promise(function (resolve, reject) {
      const PROXY_URL = window.location.protocol + '//' + window.location.hostname + ':8080/';
      request(PROXY_URL + baseUrl + ticker + "/", function (err, res, body) {

        if (err) {
          reject(err);
        }

        try {
          var price = getPrice(body, ticker);
          var change = getChange(body, ticker);
          var changePercent = getChangePercent(body, ticker);
          var atDate = getAtDate(body, ticker);
          var atTime = getAtTime(body, ticker);
          var longName = getLongName(body, ticker);
          var dayRange = getDayRange(body, ticker);
          var fiftyTwoWeekRange = getFiftyTwoWeekRange(body, ticker);

          resolve({
            ticker,
            longName,
            price,
            change,
            changePercent,
            atDate: new Date(atDate * 1000),
            atTime,
            dayRange,
            fiftyTwoWeekRange,
          });
        } catch (err) {
          reject(err)
        }
      })
    });
  });
  return Promise.all(dataPromise);
}

// Helper functions
function getPrice(body, ticker) {
  return body.split(`"${ticker}":{"sourceInterval"`)[1]
    .split("regularMarketPrice")[1]
    .split("fmt\":\"")[1]
    .split("\"")[0];
}

function getChange(body, ticker) {
  return parseFloat(body.split(`"${ticker}":{"sourceInterval"`)[1]
    .split("regularMarketChange")[1]
    .split("fmt\":\"")[1]
    .split("\"")[0]);
}

function getChangePercent(body, ticker) {
  return parseFloat(body.split(`"${ticker}":{"sourceInterval"`)[1]
    .split("regularMarketChangePercent")[1]
    .split("fmt\":\"")[1]
    .split("\"")[0]);
}

function getAtDate(body, ticker) {
  return body.split(`"${ticker}":{"sourceInterval"`)[1]
    .split("regularMarketTime")[1]
    .split(":{\"raw\":\"")[0]
    .split(":{\"raw\":")[1]
    .split("\"")[0]
    .split(',')[0];
}

function getAtTime(body, ticker) {
  return body.split(`"${ticker}":{"sourceInterval"`)[1]
    .split("regularMarketTime")[1]
    .split("fmt\":\"")[1]
    .split("\"")[0];
}

function getLongName(body, ticker) {
  return body.split(`"${ticker}":{"sourceInterval"`)[1]
    .split("longName")[1]
    .split(":")[1]
    .split(",")[0]
    .replace(/"/g, '');
}

function getShortName(body, ticker) {
  return body.split(`"${ticker}":{"sourceInterval"`)[1]
    .split("shortName")[1]
    .split(":")[1]
    .split(",")[0]
    .replace(/"/g, '')
    .replace(/\u002/, '-');
}

function getDayRange(body, ticker) {
  return body.split(`"${ticker}":{"sourceInterval"`)[1]
    .split("regularMarketDayRange")[1]
    .split("fmt\":\"")[1]
    .split("\"")[0];
}

function getFiftyTwoWeekRange(body, ticker) {
  return body.split(`"${ticker}":{"sourceInterval"`)[1]
    .split("fiftyTwoWeekRange")[1]
    .split("fmt\":\"")[1]
    .split("\"")[0];
}
