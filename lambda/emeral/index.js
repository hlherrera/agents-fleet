const agent = require("../agent").agent;
const { getAgentData, setAgentData, createData } = require("./db").db;
const { scrapLogin, scrapEmeral } = require("./emeral").scrapper;
const { sendDataToBackend } = require("./matcher.service");

const TABLE_NAME = process.env.DB_TABLE_NAME;
const AGENT_ID = process.env.ID;
const BACKEND_URL = process.env.BACKEND_URL;

exports.handler = async (event, context, callback) => {
  let browser = null;
  let candidates = [];
  let pageNumber;
  let lastPage;
  let lastCandidates;

  const item = await getAgentData(TABLE_NAME, AGENT_ID);
  if (!item.Item) {
    await createData(TABLE_NAME, AGENT_ID);
    pageNumber = 1;
    lastPage = false;
    lastCandidates = [];
  } else {
    pageNumber = item.Item.pageNumber;
    lastPage = item.Item.lastPage;
    lastCandidates = item.lastCandidates;
  }

  try {
    browser = await agent.launch();
    let page = await browser.newPage();
    await scrapLogin(page);
    [candidates, pageNumber, lastPage] = await scrapEmeral(
      page,
      pageNumber,
      lastCandidates
    );

    // @todo
    await sendDataToBackend(
      BACKEND_URL,
      candidates.map(({ isLast, ...rest }) => rest)
    )
      .catch((err) => console.error(err))
      .then((r) => console.log("- BACKEND RESPONSE: ", r));

    await setAgentData(
      TABLE_NAME,
      AGENT_ID,
      pageNumber,
      lastPage,
      candidates.filter(({ isLast }) => isLast)
    );
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
