import { LambdaFunction } from "@aws-cdk/aws-events-targets";
import * as Lambda from "@aws-cdk/aws-lambda";
import * as cdk from "@aws-cdk/core";
import * as camelcase from "camelcase";
import * as fs from "fs";
import dynamodb = require("@aws-cdk/aws-dynamodb");
import events = require("@aws-cdk/aws-events");
import path = require("path");

export interface LambdaFleetProps {
  path: string;
  store: dynamodb.Table;
  env?: string;
}

const DEFAULT_MEMORY_SIZE = 128;
const DEFAULT_TIME_DURATION = 30;

export class LambdaFleetAgents extends cdk.Construct {
  public functionList: { [key: string]: Lambda.Function } = {};
  private environ: string;
  private store: dynamodb.Table;

  constructor(scope: cdk.Construct, id: string, props: LambdaFleetProps) {
    super(scope, id);
    this.environ = props.env || "Dev";
    this.store = props.store;

    this.addFunctions(props.path);
  }

  private addFunctions(dir: string) {
    const nodes = fs.readdirSync(dir);
    nodes
      .filter((name) => fs.statSync(path.join(dir, name)).isDirectory())
      .forEach((name) => {
        const id = camelcase(`${name}${this.environ}`, { pascalCase: true });
        console.log(dir, name);
        const {
          ruleExpression,
          duration,
          memory,
          environment,
          ...dockerConfig
        } = require(path.join(dir, name, "policy.json"));

        this.functionList[id] = new Lambda.DockerImageFunction(this, id, {
          code: Lambda.DockerImageCode.fromImageAsset(dir, {
            ...dockerConfig,
          }),
          timeout: cdk.Duration.seconds(duration ?? DEFAULT_TIME_DURATION),
          memorySize: memory ?? DEFAULT_MEMORY_SIZE,
          environment: {
            ID: id,
            NAME: name,
            DB_TABLE_NAME: this.store.tableName,
            ...(environment ?? {}),
          },
        });

        if (ruleExpression) {
          const rule = new events.Rule(this, `rule-${id}`, {
            schedule: events.Schedule.expression(ruleExpression),
          });
          rule.addTarget(new LambdaFunction(this.functionList[id]));
        }

        this.store.grantReadWriteData(this.functionList[id]);

        new cdk.CfnOutput(this, `${id}Arn`, {
          value: this.functionList[id].functionArn,
        });
      });
  }
}
