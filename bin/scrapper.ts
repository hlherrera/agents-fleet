#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { ScrapperStack } from '../lib/scrapper-stack';

const app = new cdk.App();
new ScrapperStack(app, 'ScrapperStack');
