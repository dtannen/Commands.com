// // List of commands that require API calls

import { getProjects } from '../api';
import { getQuote } from '../api';
import { getReadme } from '../api';
import { getWeather } from '../api';
import Parser from "rss-parser";

var yahooService = require('../../services/yahooService');
var responseTransformer = require('../../transformer/responseTransformer');

export const projects = async (args: string[]): Promise<string> => {
  const projects = await getProjects();
  return projects
    .map(
      (repo) =>
        `${repo.name} - <a class="text-light-blue dark:text-dark-blue underline" href="${repo.html_url}" target="_blank">${repo.html_url}</a>`,
    )
    .join('\n');
};

export const quote = async (args: string[]): Promise<string> => {
  const data = await getQuote();
  return data.quote;
};

export const readme = async (args: string[]): Promise<string> => {
  const readme = await getReadme();
  return `Opening GitHub README...\n
  ${readme}`;
};

export const weather = async (args: string[]): Promise<string> => {
  const city = args.join('+');
  if (!city) {
    return 'Usage: weather [city]. Example: weather casablanca';
  }
  const weather = await getWeather(city);
  return weather;
};

export const stock = async (args: string[]): Promise<string> => {
  const stock = args.join('+');
  if (!stock) {
    return 'Usage: stock [ticker]. Example: stock AAPL';
  }
  stock = stock.toUpperCase().replaceAll(/\+/g,'');
  const tickers = stock.split(',').map((ticker) => ticker.trim());
  const quote_data = await yahooService.getCurrentPrice(tickers);
  return responseTransformer.transformCurrentPrice(quote_data);
};

export const news = async (args: string[]): Promise<string> => {
  let parser = new Parser();
  const PROXY_URL = window.location.protocol + '//' + window.location.hostname + ':8080/';
  let feed = await parser.parseURL(PROXY_URL + "http://feeds.bbci.co.uk/news/world/rss.xml");
  const news = "";
  feed.items.forEach(item => {
      news = news + `<a class="text-light-blue dark:text-dark-blue underline" href="${item.link}" target="_blank">${item.title}</a>\n`;
  });
  return `Current News...\n${news}`;
};

export const xkcd = async (args: string[]): Promise<string> => {
  let parser = new Parser();
  const PROXY_URL = window.location.protocol + '//' + window.location.hostname + ':8080/';
  let feed = await parser.parseURL(PROXY_URL + "https://xkcd.com/rss.xml");
  console.log(feed);
  const news = "";
  feed.items.forEach(item => {
      news = news + `<a class="text-light-blue dark:text-dark-blue underline" href="${item.link}" target="_blank">${item.title}</a> - ${item.content}\n`;
  });
  return `${news}`;
};
