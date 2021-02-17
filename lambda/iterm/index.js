const agent = require("../agent").agent;
const { scrapPage } = require("./itterm").scrapper;

const PAGES = "abcdefghijklmnopqrstuvwxyz".split("");
exports.handler = async (event, context) => {
  let browser = null;
  let accumulated = {};
  try {
    browser = await agent.launch();
    let page = await browser.newPage();

    for (let i = 0; i < PAGES.length; i++) {
      console.log(`Scrapping page: ${PAGES[i]}`);
      const terms = await scrapPage(page, PAGES[i]);
      const definitions = terms
        .filter(([, , definition]) => definition)
        .reduce((acc, cur) => {
          let [term, , definition] = cur;
          const expr = definition.replace(/-/g, " ");
          const [, key] = term.match(/\((.+)\)$/) || [, term];
          if (key !== expr.toLowerCase()) {
            acc[key] = acc[key]
              ? Array.from(new Set(acc[key]).add(expr).values())
              : [expr];
          }
          return acc;
        }, {});
      accumulated = { ...accumulated, ...definitions };
    }

    await page.close();
  } catch (error) {
    throw error;
  } finally {
    if (browser !== null) {
      await browser.close();
    }
  }
  console.log("Entries:");
  console.log(JSON.stringify(Object.entries(accumulated)));

  return accumulated;
};
