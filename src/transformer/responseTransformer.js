var Table = require('cli-table3');
var colors = require('colors');
colors.enable();
var AU = require('ansi_up');

module.exports = {
  transformCurrentPrice: transformCurrentPrice,
  transformError: transformError,
  transformExportJsonSuccess: transformExportJsonSuccess,
  transformExportCsvSuccess: transformExportCsvSuccess,
};

function transformCurrentPrice(data) {
  var table = new Table({
    head: [
      'Stock Name',
      'Current Price',
      'Change',
      '% Change',
      'Day Range',
      '52 Week Range'
    ],
    style: {
      head: []
    },
  });

  for (let i = 0; i < data.length; i++) {
    const hex = (data[i].change > 0) ? '008000' : 'FF0000';
    table.push(
      [
        data[i].longName,
        data[i].price,
        (data[i].change < 0) ? data[i].change : data[i].change,
        (data[i].changePercent < 0) ? data[i].changePercent : data[i].changePercent,
        data[i].dayRange,
        data[i].fiftyTwoWeekRange,
      ]
    );
  }

  return '\n' + table.toString() + '\n' + data[0].atDate + '\n\n'
    + `DISCLAIMER: For information purpose. Do not use for trading.\n`;
}

function transformError(error) {
  return `\nSorry, we couldn't find. Please check the stock ticker and provide correct one.\n\n ${error.message}`;
}

function transformExportJsonSuccess() {
  return `\nExported to json successfully.\nStored in: ${process.cwd()}\n`;
}

function transformExportCsvSuccess() {
  return `\nExported to csv successfully.\nStored in: ${process.cwd()}\n`;
}
