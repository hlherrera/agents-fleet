# Large scale Agents for Scrapping and Processing URLs

This project shows how you can scrap URL documents through Agents at scale.

It uses Chromium for web scrapping and connects each agent to DynamoDB for storage.

Agent Iterm is an example of an Agent for documentation purposes.
Agent Emeral scrap Emeral Site for candidates data, index data in an ML System and push data to the Backend.

## Useful commands

- `cdk deploy` deploy this stack to your default AWS account/region
- `cdk diff` compare deployed stack with current state
- `cdk synth` emits the synthesized CloudFormation template

## Simple Doc

### \_

### 1. Add Agent's Files to the Project.

![picture](https://github.com/hlherrera/agents-fleet/blob/main/doc/project.png)

### \_

### 2. Configure policy for an Agent.

![picture](https://github.com/hlherrera/agents-fleet/blob/main/doc/config.png)

### \_

### 3. Main file for execution.

![picture](https://github.com/hlherrera/agents-fleet/blob/main/doc/main.png)
