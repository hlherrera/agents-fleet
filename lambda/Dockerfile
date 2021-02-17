
ARG FUNCTION_DIR="/function"

FROM public.ecr.aws/lambda/nodejs:12

# === BAKE BROWSERS INTO IMAGE ===
WORKDIR ${LAMBDA_TASK_ROOT}

# node.js modules packages.
COPY package.json ${LAMBDA_TASK_ROOT}/package.json
RUN npm install --silent --no-lock --production

COPY agent.js ${LAMBDA_TASK_ROOT}/agent.js

# Copy source files for each fn
RUN mkdir emeral
COPY emeral/* ${LAMBDA_TASK_ROOT}/emeral/

RUN mkdir iterm
COPY iterm/* ${LAMBDA_TASK_ROOT}/iterm/