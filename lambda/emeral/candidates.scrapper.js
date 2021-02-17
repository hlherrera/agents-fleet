//------------------------------------------------------------------------------------------------
// SELECTORS

const candidatesSelector = "#tabla-lista-candidatos tr.candidate-row";

//------------------------------------------------------------------------------------------------
const EMERAL_CANDIDATES_PAGE = process.env.EMERAL_CANDIDATES_PAGE;
const scrapEmeralCandidates = async (page, number) => {
  await page.goto(EMERAL_CANDIDATES_PAGE.replace("{#}", number));
  let results = [];

  try {
    await page.waitForSelector(candidatesSelector);
    results = await page.evaluate((selector) => {
      return Array.from(document.querySelectorAll(selector)).map((c) => {
        const [, pageId] = c
          .querySelector("div.candidato-avatar > a")
          .href.match(/candidates\/([\d]+)/);
        const href = c
          .querySelector("div.candidato-avatar > a")
          .href.replace(/\/popup_view/, "");
        const name = c.querySelector("div.nya a").textContent.trim();
        const [email, phone] = (
          c.querySelector("td.candidate-row__contact") || {
            textContent: "- \n -",
          }
        ).textContent
          .trim()
          .split(/\n\s+/);
        return { pageId, href, name, email, phone };
      });
    }, candidatesSelector);
  } catch (error) {
    console.error(error);
  }
  return results;
};

exports.scrapCandidatesPage = scrapEmeralCandidates;
