const { transformDates } = require("./date");

//------------------------------------------------------------------------------------------------
// SELECTORS

const datesSelector = "div.profile-details .aplico-en";

const profileSelector =
  "div.profile-container > div.profile-tabs > ul > li:nth-child(1) > div > div.seccion-candidato.datos-contacto-candidato";

const positionSelector =
  "div.profile-container > div.profile-tabs > ul > li:nth-child(3) .tab-content > table > tbody tr";

const cvSelector = "div.seccion-candidato > a";

//------------------------------------------------------------------------------------------------
const scrapDates = (selector) =>
  Array.from(document.querySelectorAll(selector)).map((c) => {
    [
      [, createdDay, createdMonth, createdYear],
      [, updatedDay, updatedMonth, updatedYear],
    ] = c.textContent
      .replace(/(creado el )|(actualizado el )/gi, "")
      .split(/\s+-\s+/)
      .map((d) => d.match(/([\d]{1,2})\sde\s([a-zA-Z]+)\sde\s([0-9]{4})/i));

    return {
      createdDay,
      createdMonth,
      createdYear,
      updatedDay,
      updatedMonth,
      updatedYear,
    };
  });

//------------------------------------------------------------------------------------------------

const scrapProfile = (selector) => {
  const getRutAndAddress = (c) => {
    let address = "";
    let rut = "";
    const length = c.querySelectorAll("span").length;
    for (let i = 2; i < length + 1; i++) {
      if (address === "") {
        [, address] = (
          c.querySelector(`span:nth-child(${i})`) || { textContent: "" }
        ).textContent.match(/direcci[oó]n\:\s(.+)$/i) || ["", ""];
      }
      if (rut === "") {
        [, rut] = (
          c.querySelector("span:nth-child(5)") || { textContent: "" }
        ).textContent
          .replaceAll(/[\.-]/gi, "")
          .match(/rut\:\s([0-9]{7,8}[0-9k])$/i) || ["", ""];
      }
    }
    return { rut, address };
  };

  return Array.from(document.querySelectorAll(selector)).map((c) => {
    const [emeralId] = (
      c.querySelector("span:nth-child(1)") || { textContent: "" }
    ).textContent.match(/[0-9]+/);

    const { rut, address } = getRutAndAddress(c);

    return {
      emeralId,
      address,
      rut,
    };
  });
};
//------------------------------------------------------------------------------------------------

const scrapApplications = (selector) =>
  Array.from(document.querySelectorAll(selector)).map((c) => {
    const [, emeralPositionId] = (
      c.querySelector("td:nth-child(1)>a") || { href: "/" }
    ).href.match(/(\d+)/) || ["", ""];
    const name = c.querySelector("td:nth-child(1)").textContent;
    const company = c.querySelector("td:nth-child(2)").textContent;

    const stageStatus = c
      .querySelector("td:nth-child(3) img")
      .src.includes("error")
      ? "REJECTED"
      : "APPROVED";
    const stageName = c.querySelector("td:nth-child(3)").textContent.trim();
    const [, dd, mm, yyyy] = c
      .querySelector("td:nth-child(4)")
      .textContent.match(/(\d{2})\/(\d{2})\/(\d{4})/);
    const status = c.querySelector("td:nth-child(5)").textContent;

    return {
      emeralPositionId,
      name,
      company,
      stageName,
      stageStatus,
      status,
      updatedAt: new Date(+yyyy, +mm, +dd).getTime(),
    };
  });
//------------------------------------------------------------------------------------------------

const scrapDocumentCV = (selector) => {
  const pdfURL = (document.querySelector(selector) || {}).href;
  return /.pdf\?\d+$/.test(pdfURL) ? pdfURL : "";
};
//------------------------------------------------------------------------------------------------

const scrapCandidatePage = async (page, href) => {
  await page.goto(href);
  await page.waitForSelector(datesSelector);

  const [dates] = await page.evaluate(scrapDates, datesSelector);
  const [profile] = await page.evaluate(scrapProfile, profileSelector);
  const applications = await page.evaluate(scrapApplications, positionSelector);
  const cvURL = await page.evaluate(scrapDocumentCV, cvSelector);

  const { createdAt, updatedAt } = transformDates(dates);

  return [
    cvURL,
    {
      ...profile,
      createdAt,
      updatedAt,
      applications,
    },
  ];
};

exports.scrapCandidateProfile = scrapCandidatePage;
