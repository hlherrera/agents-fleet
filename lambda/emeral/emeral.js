const { scrapCandidateProfile } = require("./profile.scrapper");
const { scrapCandidatesPage } = require("./candidates.scrapper");
const { scrapLogin } = require("./login.scrapper");
const { downloadAndSendCV } = require("./matcher.service");

const ITEMS_PER_PAGE = 25;
const PAGES_TO_ANALYZE = 20;
const CV_MATCHER_URL = process.env.CV_MATCHER_URL;

const scrapEmeral = async (page, start) => {
  let pageNumber = start;
  let results = [];
  let candidates = [];
  let currentPages = 0;

  do {
    results = await scrapCandidatesPage(page, pageNumber);
    for (let i = 0; i < results.length; i++) {
      const { href, ...rest } = results[i];
      const [cvURL, candidateData] = await scrapCandidateProfile(page, href);
      const mlResponse = await downloadAndSendCV(cvURL, CV_MATCHER_URL);

      candidates = [
        ...candidates,
        { href, ...candidateData, cvMatcherId: mlResponse.id, ...rest },
      ];
    }
    console.log(
      "- Current Page: " + pageNumber,
      "- Accumulated Candidates: " + candidates.length
    );
    currentPages++;
    pageNumber += results.length === ITEMS_PER_PAGE;
  } while (
    results.length === ITEMS_PER_PAGE &&
    currentPages < PAGES_TO_ANALYZE
  );

  return [candidates, results.length === 0 ? 1 : pageNumber];
};

exports.scrapper = {
  scrapLogin,
  scrapEmeral,
};
