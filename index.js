const core = require('@actions/core');
const github = require('@actions/github');
const request = require('request');

const BASE_BRANCH_NAME = "develop";
const FEATURE_BRANCH_PREFIX = "feature/";

function isMergedPr() {
  const payload = github.context.payload;
  return payload.action == "closed" && payload.pull_request.merged;
}

function getPrBranchName() {
  const payload = github.context.payload;
  return payload.pull_request.head.ref;
}

function isFeatureBranch() {
  const payload = github.context.payload;
  const headBranchName = getPrBranchName();
  const baseBranchName = payload.pull_request.base.ref;

  return baseBranchName == BASE_BRANCH_NAME && headBranchName.startsWith(FEATURE_BRANCH_PREFIX);
}

function logPayload() {
  const webHookPayload = github.context.payload;
  console.log("Payload:");
  console.log(JSON.stringify(webHookPayload));
}

function sendChatMessage(hookUrl, message) {
  const options = {
    url: hookUrl,
    json: true,
    body: {
      body: message
    }
  };

  console.log("Posting message: '" + message + "'");
  console.log(JSON.stringify(options));

  request.post(options, (err, res, body) => {
    if (err) {
      return console.log(err);
    }
    console.log(`Status: ${res.statusCode}`);
    console.log(body);
  });
}

try {
  const chatHookUrl = core.getInput('CHAT_HOOK_URL');

  if (!chatHookUrl) {
    console.log('Invalid input');
  } else {

    logPayload();

    console.log("isMergedPr: " + isMergedPr());
    console.log("isFeatureBranch: " + isFeatureBranch());

    if (isMergedPr() && isFeatureBranch()) {      
      const message = `:twisted_rightwards_arrows: Feature branch \`${getPrBranchName()}\` merged into \`${BASE_BRANCH_NAME}\``;
      sendChatMessage(chatHookUrl, message);
    } else {
      console.log("Nothing to send to Chat");
    }

  }
} catch (error) {
  core.setFailed(error.message);
}