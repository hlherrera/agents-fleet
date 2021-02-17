const { scrapCandidateProfile } = require("./profile.scrapper");
const { scrapCandidatesPage } = require("./candidates.scrapper");
const { scrapLogin } = require("./login.scrapper");

const PAGES_TO_ANALYZE = 20;

const scrapEmeral = async (page, start) => {
  let pageNumber = start;
  let results = [];
  let candidates = [];
  let currentPages = 0;

  do {
    results = await scrapCandidatesPage(page, pageNumber);
    for (let i = 0; i < results.length; i++) {
      const { href, ...rest } = results[i];
      const candidateData = await scrapCandidateProfile(page, href);
      candidates = [...candidates, { href, ...candidateData, ...rest }];
    }
    console.log(
      "- Current Page: " + pageNumber,
      "- Accumulated Candidates: " + candidates.length
    );
    currentPages++;
    pageNumber++;
  } while (results.length > 0 && currentPages < PAGES_TO_ANALYZE);

  return [candidates, results.length === 0 ? 1 : pageNumber];
};

exports.scrapper = {
  scrapLogin,
  scrapEmeral,
};
