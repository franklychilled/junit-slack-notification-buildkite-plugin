import {NightWatchResult} from "./interfaces/nightWatchResult.interface";
import {sendSlackMessage} from "./slack-web-api";

export const getColor = (result: NightWatchResult): string => {
    if (result.tests_failed > 0) {
        return "#B94A48";
    }
    const summary = getSummary(result);
    if (summary.length === 0) {
        return "#B94A48";
    }
    return "#69A76A";
};

export const getEmoij = (result: NightWatchResult): string => {
    if (result.tests_failed > 0) {
        return ":-1: :-1:";
    }
    const summary = getSummary(result);
    if (summary.length === 0) {
        return ":-1:";
    }
    return ":+1:";
};

export const getSummary = (result: NightWatchResult): string[] => {
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

export const getTextSummaryLine = (result: NightWatchResult): string => {
    const summary = getSummary(result);
    if (summary.length > 0) {
        return `Tests ${summary.join(", ")}`;
    }
    return "No tests data generated!";
};

export const getText = (result: NightWatchResult): string => {
    return `${getEmoij(result)} *${result.buildkite_pipeline} (${result.git_branch_name}) #${result.build_id}*\n${result.git_comment} - ${result.git_username} (${result.git_log})\n*${getTextSummaryLine(result)}*\n<${result.build_url}|View build>`;
};

export const getSlackMessageAttachments = (result: NightWatchResult): any => {
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

export const sendResultToSlack = async (slackToken: string, channel: string, nightwatchResult: NightWatchResult): Promise<any> => {
    let goodToken = "";
    for (let i = 0; i < slackToken.length; i++) {
        if (checkChar(slackToken[i])) {
            goodToken += slackToken[i];
        } else {
            console.log(`Invalid character in token - code: ${slackToken.charCodeAt(i)} => ${slackToken[i]}'`);
        }
    }
    return sendSlackMessage(goodToken, channel, getSlackMessageAttachments(nightwatchResult));
};

const checkChar = (c: string) => {
    const code = c.charCodeAt(0);
    const isAlpha = code >= "a".charCodeAt(0) && code <= "z".charCodeAt(0);
    const isUpperAlpha = code >= "A".charCodeAt(0) && code <= "Z".charCodeAt(0);
    const isNumber = code >= "0".charCodeAt(0) && code <= "9".charCodeAt(0);
    const isDash = code == "-".charCodeAt(0);
    return isAlpha || isUpperAlpha || isNumber || isDash;
};
