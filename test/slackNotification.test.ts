import { NightWatchResult } from "../src/interfaces/nightWatchResult.interface";
import { getColor, getEmoij, getSummary, getSlackMessageAttachments, getText, getTextSummaryLine, sendResultToSlack } from "../src/slackNotification";
import { describe, expect, it, xit } from "@jest/globals";

describe("Failed test", () => {
  const result:NightWatchResult = {
    tests_failed: 3,
    build_id: 123,
    build_url: "https://www.iress.com/mybuild",
    buildkite_pipeline: "My Build pipeline",
    git_branch_name: "hac-483_branch",
    git_comment: "Initial commit",
    git_log: "a1b2c3",
    git_username: "F T",
    tests_passed: 1,
    tests_ignored: 2
  };

  it("should return red", (done) => {
    const actual = getColor(result);

    expect(actual).toBe("#B94A48");
    done();
  });

  it("should return negative emoij", (done) => {
    const actual = getEmoij(result);

    expect(actual).toBe(":-1: :-1:");
    done();
  });

  it("should return summary slack message", (done) => {
    const actual = getSlackMessageAttachments(result);

    expect(actual).toStrictEqual([
        {
          "color": "#B94A48",
          "blocks": [
            {
              "type": "section",
              "text": {
                "type": "mrkdwn",
                "text": ":-1: :-1: *My Build pipeline (hac-483_branch) #123*\nInitial commit - F T (a1b2c3)\n*Tests failed: 3, passed: 1, ignored: 2*\n<https://www.iress.com/mybuild|View build>"
              }
            }
          ]
        }
      ]);
    done();
  });

  xit("send message to slack channel",  async (done) => {
    const SLACK_TOKEN = "xoxb-81534569220-1172879139954-meWCu1UEHiROrgOFX5n4CWuM";
    const SLACK_CHANNEL = "hac-483_testing";

    await sendResultToSlack(SLACK_TOKEN, SLACK_CHANNEL, result);

    done();
  });
});

describe("Passed test", () => {
  const result:NightWatchResult = {
    tests_failed: 0,
    build_id: 456,
    build_url: "https://www.iress.com/myotherbuild",
    buildkite_pipeline: "My Build other pipeline",
    git_branch_name: "hac-483_other_branch",
    git_comment: "Second commit",
    git_log: "a1b2c3d4",
    git_username: "Frankly Chilled",
    tests_passed: 1,
    tests_ignored: 0
  };

  it("should return green", (done) => {

    const actual = getColor(result);

    expect(actual).toBe("#69A76A");
    done();
  });

  it("should return summary slack message", (done) => {
    const actual = getSlackMessageAttachments(result);

    expect(actual).toStrictEqual([
        {
          "blocks": [
            {
              "text": {
                "text": ":+1: *My Build other pipeline (hac-483_other_branch) #456*\nSecond commit - Frankly Chilled (a1b2c3d4)\n*Tests passed: 1*\n<https://www.iress.com/myotherbuild|View build>",
                "type": "mrkdwn"
              },
              "type": "section"
            }
          ],
          "color": "#69A76A"
        }
      ]);
    done();
  });

  xit("send message to slack channel",  async (done) => {
    const SLACK_TOKEN = "xoxb-81534569220-1172879139954-meWCu1UEHiROrgOFX5n4CWuM";
    const SLACK_CHANNEL = "hac-483_testing";

    await sendResultToSlack(SLACK_TOKEN, SLACK_CHANNEL, result);

    done();
  });
});

describe("No tests", () => {
  const result:NightWatchResult = {
    tests_failed: 0,
    build_id: 789,
    build_url: "https://www.iress.com/myotherbuild",
    buildkite_pipeline: "My Build other pipeline",
    git_branch_name: "hac-483_other_branch",
    git_comment: "Second commit",
    git_log: "a1b2c3d4",
    git_username: "Frankly Chilled",
    tests_passed: 0,
    tests_ignored: 0
  };

  it("should return summary slack message", (done) => {
    const actual = getSlackMessageAttachments(result);

    expect(actual).toStrictEqual([
      {
        "blocks": [
          {
            "text": {
              "text": ":+1: *My Build other pipeline (hac-483_other_branch) #789*\nSecond commit - Frankly Chilled (a1b2c3d4)\n*No tests detected*\n<https://www.iress.com/myotherbuild|View build>",
              "type": "mrkdwn"
            },
            "type": "section"
          }
        ],
        "color": "#69A76A"
      }
    ]);
    done();
  });

  xit("send message to slack channel",  async (done) => {
    const SLACK_TOKEN = "xoxb-81534569220-1172879139954-meWCu1UEHiROrgOFX5n4CWuM";
    const SLACK_CHANNEL = "hac-483_testing";

    await sendResultToSlack(SLACK_TOKEN, SLACK_CHANNEL, result);

    done();
  });
});