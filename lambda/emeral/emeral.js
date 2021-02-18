const { scrapCandidateProfile } = require("./profile.scrapper");
const { scrapCandidatesPage } = require("./candidates.scrapper");
const { scrapLogin } = require("./login.scrapper");
const { downloadAndSendCV } = require("./matcher.service");

const ITEMS_PER_PAGE = 25;
const PAGES_TO_ANALYZE = 4;
const CV_MATCHER_URL = process.env.CV_MATCHER_URL;

const scrapEmeral = async (page, start, lastCandidates) => {
  let pageNumber = start;
  let results = [];
  let candidates = [];
  let currentPages = 0;
  let isLast;

  do {
    results = await scrapCandidatesPage(page, pageNumber);
    isLast = results.length < ITEMS_PER_PAGE;
    for (let i = 0; i < results.length; i++) {
      const { href, ...rest } = results[i];
      const [cvURL, candidateData] = await scrapCandidateProfile(page, href);

      const candidate = lastCandidates
        .filter(({ emeralId }) => candidateData.emeralId === emeralId)
        .pop();

      const mlResponse = await downloadAndSendCV(
        cvURL,
        CV_MATCHER_URL,
        candidate
      );

      candidates = [
        ...candidates,
        { href, isLast, ...candidateData, cvMatcherId: mlResponse.id, ...rest },
      ];
    }
    console.log(
      "- Current Page: " + pageNumber,
      "- Accumulated Candidates (total): " + candidates.length,
      "- Are last Candidates (total): " + (isLast ? results.length : 0)
    );
    currentPages++;
    pageNumber += !isLast;
  } while (!isLast && currentPages < PAGES_TO_ANALYZE);

  return [candidates, pageNumber, isLast];
};

exports.scrapper = {
  scrapLogin,
  scrapEmeral,
};
