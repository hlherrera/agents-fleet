const axios = require("axios");

const downloadAndSendCV = async (downloadURL, uploadURL, candidate) => {
  let response = { data: {} };
  if (downloadURL && downloadURL.length > 0) {
    const pathURL = candidate ? `/${candidate.cvMatcherId}` : "";
    try {
      response = await axios({
        method: "GET",
        url: downloadURL,
        responseType: "arraybuffer",
      });
      response = await axios({
        method: "PUT",
        url: `${uploadURL}/documents${pathURL}`,
        headers: {
          "Content-Type": "application/pdf",
        },
        data: response.data,
      });
    } catch (err) {
      console.error(err);
    }
  }
  return response.data;
};

const sendDataToBackend = async (backendURL, data) => {
  let response = { data: {} };
  try {
    response = await axios({
      method: "POST",
      url: `${backendURL}/cv/import/emeral`,
      headers: {
        "Content-Type": "application/json",
      },
      data,
    });
  } catch (err) {
    console.error(err);
  }

  return response.data;
};

exports.downloadAndSendCV = downloadAndSendCV;
exports.sendDataToBackend = sendDataToBackend;
