import * as cdk from "@aws-cdk/core";
import { LambdaFleetAgents } from "./lambda-fleet-agents";
import events = require("@aws-cdk/aws-events");
import iam = require("@aws-cdk/aws-iam");
import dynamodb = require("@aws-cdk/aws-dynamodb");

import path = require("path");

const ENV = "DEV";
export class ScrapperStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const controlTable = new dynamodb.Table(this, "ControlTable" + ENV, {
      partitionKey: { name: "agentId", type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
    });

    // Lambda agents fleet
    new LambdaFleetAgents(this, id, {
      path: path.resolve(__dirname, "../lambda"),
      store: controlTable,
      env: ENV,
    });
  }
}
