const { DynamoDB } = require("aws-sdk");
const ddb = new DynamoDB.DocumentClient();

const getPageNumber = async (TableName, id) => {
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

const createPageNumber = async (TableName, id) => {
  const data = await ddb
    .put({
      TableName,
      Item: {
        agentId: id,
        pageNumber: 1,
      },
    })
    .promise();
  return data;
};

const setPageNumber = async (TableName, id, pageNumber, candidates) => {
  const data = await ddb
    .update({
      TableName,
      Key: {
        agentId: id,
      },
      UpdateExpression: "set pageNumber = :p, candidates = :candidates",
      ExpressionAttributeValues: {
        ":p": pageNumber,
        ":candidates": candidates,
      },
      ReturnValues: "UPDATED_NEW",
    })
    .promise();
  return data;
};

exports.db = { getPageNumber, setPageNumber, createPageNumber };
