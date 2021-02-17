const agent = require("../agent").agent;
const { getPageNumber, setPageNumber, createPageNumber } = require("./db").db;
const { scrapLogin, scrapEmeral } = require("./emeral").scrapper;
const { sendDataToBackend } = require("./matcher.service");

const TABLE_NAME = process.env.DB_TABLE_NAME;
const AGENT_ID = process.env.ID;
const BACKEND_URL = process.env.BACKEND_URL;

exports.handler = async (event, context, callback) => {
  let browser = null;
  let candidates = [];
  let pageNumber;

  const item = await getPageNumber(TABLE_NAME, AGENT_ID);
  if (!item.Item) {
    await createPageNumber(TABLE_NAME, AGENT_ID);
    pageNumber = 1;
  } else {
    pageNumber = item.Item.pageNumber;
  }

  try {
    browser = await agent.launch();
    let page = await browser.newPage();
    await scrapLogin(page);
    [candidates, pageNumber] = await scrapEmeral(page, pageNumber);

    // @todo
    await sendDataToBackend(BACKEND_URL, candidates)
      .catch((err) => console.error(err))
      .then((r) => console.log("- BACKEND RESPONSE: ", r));

    await setPageNumber(TABLE_NAME, AGENT_ID, pageNumber, candidates);
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
