# Large scale Agents for Scrapping and Processing URLs

This project shows how you can scrap URL documents through Agents at scale.

It uses Chromium for web scrapping and connects each agent to DynamoDB for storage.

Agent Iterm is an example of an Agent for documentation purposes.
Agent Emeral scrap Emeral Site for candidates data, index data in an ML System and push data to the Backend(https://recruiter-back.23people.io/).

## Useful commands

- `cdk deploy` deploy this stack to your default AWS account/region
- `cdk diff` compare deployed stack with current state
- `cdk synth` emits the synthesized CloudFormation template

## Simple Doc

### \_

### 1. Add Agent's Files to the Project.

![Test Image Project](doc/project.png)

### \_

### 2. Configure policy for an Agent.

![Test Image Config](doc/config.png)

### \_

### 3. Main file for execution.

![Test Image Config](doc/main.png)
