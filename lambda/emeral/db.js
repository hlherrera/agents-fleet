const { DynamoDB } = require("aws-sdk");
const ddb = new DynamoDB.DocumentClient();

const getAgentData = async (TableName, id) => {
  const data = await ddb
    .get({
      TableName,
      Key: {
        agentId: id,
      },
    })
    .promise();
  return data;
};

const createData = async (TableName, id) => {
  const data = await ddb
    .put({
      TableName,
      Item: {
        agentId: id,
        pageNumber: 1,
        lastPage: false,
        lastCandidates: [],
      },
    })
    .promise();
  return data;
};

const setAgentData = async (
  TableName,
  id,
  pageNumber,
  lastPage,
  lastCandidates
) => {
  const data = await ddb
    .update({
      TableName,
      Key: {
        agentId: id,
      },
      UpdateExpression:
        "set pageNumber = :p, lastPage = :lastPage, lastCandidates = :lastCandidates",
      ExpressionAttributeValues: {
        ":p": pageNumber,
        ":lastPage": lastPage,
        ":lastCandidates": lastCandidates,
      },
      ReturnValues: "UPDATED_NEW",
    })
    .promise();
  return data;
};

exports.db = { getAgentData, setAgentData, createData };
