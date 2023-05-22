const puppeteer = require('puppeteer');

const searchAmazon = async (codes) => {
  const browser = await puppeteer.launch({ headless: true, });
  const page = await browser.newPage();
  const listPrices = [];
  try {
    await page.goto("https://www.amazon.es/");
    await page.evaluate(() => {
      const inputAlter = document.querySelector("#nav-bb-search");
      if (inputAlter) location.reload();
    });
    await waitPlease(2000);
    await page.waitForSelector("#twotabsearchtextbox");
    await page.evaluate(() => {
      const cookieButton = document.querySelector("#sp-cc-accept");
      if (cookieButton) cookieButton.click();
    });
    //////////////////////////////
    for (const code of codes) {
      const price = await loadUrl(page, code);
      listPrices.push(price);
    };
    await browser.close();
    //////////////////////////////
    return [codes, listPrices];
  } catch (err) {
    await browser.close();
    console.log(err);
    return [];
  };
};

const waitPlease = async (ms) => new Promise(resolve => setTimeout(resolve, ms));

const loadUrl = async (page, code) => {
  try {
    await page.type("#twotabsearchtextbox", code);
    await page.click(".nav-search-submit input");
    await page.waitForNavigation();
    const price = await page.evaluate(() => {
      const noResults = document.querySelectorAll('.s-no-outline span');
      const elements = document.querySelectorAll("[data-component-type=s-search-result]");
      const firstElement = elements[0].querySelector('.a-price-whole');
      if (!firstElement){
        return "no price";
      } else if (noResults[1].innerText == 'No hay resultados para ') {
        return "no exist";
      } else {
        return `${firstElement.innerText} €`;
      };
    });
    await page.evaluate(() => {
      const cookieButton = document.querySelector("#sp-cc-accept");
      if (cookieButton) cookieButton.click();
    });
    await page.evaluate(() => document.querySelector("#twotabsearchtextbox").value = '');
    return price;
  } catch (err) {
    console.log(err);
    return "error";
  };
};

module.exports = {
  searchAmazon,
};
