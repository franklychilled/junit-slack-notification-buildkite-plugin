import { NightWatchResult } from "./interfaces/nightWatchResult.interface";
import { sendSlackMessage } from "./slack-web-api";

export const getColor = (result: NightWatchResult) => {
  if (result.tests_failed > 0) {
    return "#B94A48";
  }
  return "#69A76A";
};

export const getEmoij = (result: NightWatchResult) => {
  if (result.tests_failed > 0) {
    return ":-1: :-1:";
  }
  return ":+1:";
};

export const getSummary = (result: NightWatchResult) => {
  const summary = [];
  if (result.tests_failed > 0) {
    summary.push(`failed: ${result.tests_failed}`);
  }
  if (result.tests_passed > 0) {
    summary.push(`passed: ${result.tests_passed}`);
  }
  if (result.tests_ignored > 0) {
    summary.push(`ignored: ${result.tests_ignored}`);
  }
  return summary;
};

export const getTextSummaryLine = (result: NightWatchResult) => {
  const summary = getSummary(result);
  if (summary.length > 0) {
    return `Tests ${summary.join(", ")}`;
  }
  return "No tests detected";
};

export const getText = (result: NightWatchResult) => {
  return `${getEmoij(result)} *${result.buildkite_pipeline} (${result.git_branch_name}) #${result.build_id}*\n${result.git_comment} - ${result.git_username} (${result.git_log})\n*${getTextSummaryLine(result)}*\n<${result.build_url}|View build>`;
};

export const getSlackMessageAttachments = (result: NightWatchResult) => {
  return [
    {
      "color": getColor(result),
      "blocks": [
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": getText(result)
          }
        }
      ]
    }
  ];
};

export const sendResultToSlack =  async (slackToken: string, channel:string,  nightwatchResult: NightWatchResult) => {
  return sendSlackMessage(slackToken, channel, getSlackMessageAttachments(nightwatchResult));
};