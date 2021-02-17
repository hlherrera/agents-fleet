const agent = require("../agent").agent;
const { getPageNumber, setPageNumber, createPageNumber } = require("./db").db;
const { scrapLogin, scrapEmeral } = require("./emeral").scrapper;

exports.handler = async (event, context, callback) => {
  let browser = null;
  let candidates = [];
  let pageNumber;
  const tableName = process.env.DB_TABLE_NAME;
  const agentId = process.env.ID;
  const item = await getPageNumber(tableName, agentId);
  if (!item.Item) {
    await createPageNumber(tableName, agentId);
    pageNumber = 1;
  } else {
    pageNumber = item.Item.pageNumber;
  }

  try {
    browser = await agent.launch();
    let page = await browser.newPage();
    await scrapLogin(page);
    [candidates, pageNumber] = await scrapEmeral(page, pageNumber);
    await setPageNumber(tableName, agentId, pageNumber, candidates);
    await page.close();
  } catch (error) {
    return callback(error);
  } finally {
    if (browser !== null) {
      await browser.close();
    }
  }

  return callback(null, candidates);
};
