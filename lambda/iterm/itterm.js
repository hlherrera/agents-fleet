//------------------------------------------------------------------------------------------------
// SELECTORS

const termsSelector = ".main .firstColumn li > a";

const meaningSelector = "div.term-item-wrapper > div.definitionOrSaysContent p";

//------------------------------------------------------------------------------------------------
const IT_TERMS_URL = process.env.IT_TERMS_URL;

const scrapPage = async (page, term) => {
  await page.goto(IT_TERMS_URL + "/" + term);
  await page.waitForSelector(termsSelector);

  const results = await page.evaluate((selector) => {
    return Array.from(document.querySelectorAll(selector)).map((a) => [
      a.textContent.toLowerCase(),
      a.href,
      (a.href.match(/\/definition\/\d+\/([\w-.]+)$/) || [,])[1],
    ]);
  }, termsSelector);
  return results;
};

const scrapWord = async (browser, href) => {
  const page = await browser.newPage();
  await page.goto(href);
  console.log("go to :" + href);
  await page.waitForSelector(meaningSelector);
  console.log("start");
  const [definition] = await page.evaluate((selector) => {
    return Array.from(document.querySelectorAll(selector)).map(
      (word) => word.textContent
    );
  }, meaningSelector);
  console.log("scrapped: " + definition);
  await page.close();
  return definition;
};

exports.scrapper = { scrapPage, scrapWord };
