//------------------------------------------------------------------------------------------------
// SELECTORS

const resultsSelector =
  "div.position-table-card__header > div.position-table-card__title";

const emailSelector = "#user_email";

const passwordSelector = "#user_password";

const btnSelector = "div.form-actions > input.btn";

//------------------------------------------------------------------------------------------------
const EMERAL_LOGIN_URL = process.env.EMERAL_LOGIN_URL;
const USER_EMAIL = process.env.USER_EMAIL;
const USER_PASS = process.env.USER_PASS;

const loginToEmeral = async (page) => {
  await page.goto(EMERAL_LOGIN_URL);
  await page.waitForSelector(emailSelector);

  await page.type(emailSelector, USER_EMAIL);
  await page.type(passwordSelector, USER_PASS);

  await page.waitForSelector(btnSelector);
  await page.click(btnSelector);

  await page.waitForSelector(resultsSelector);
  const title = await page.title();
  console.log("- Logging and navigate into page: " + title);
};
exports.scrapLogin = loginToEmeral;
