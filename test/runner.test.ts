import {describe, expect, it, beforeEach} from "@jest/globals";
import { sendResultToSlack } from "../src/slackNotification";
import mockedEnv from "mocked-env";
let restore = mockedEnv({
    BUILDKITE_COMMIT: "0123456789",
    SLACK_TOKEN: "slack-token",
    SLACK_CHANNEL: "slack-channel",
}); // to restore old values

const sendResultToSlackMock = jest.fn().mockResolvedValue({});
jest.mock("../src/slackNotification", () => ({
    sendResultToSlack: sendResultToSlackMock
}));
const parseFilesMock = jest.fn().mockResolvedValue([]);
jest.mock("../src/xmlParser", () => ({
    parseFiles: parseFilesMock
}));
//
const addStatsToCommitMock = jest.fn().mockResolvedValue({});
jest.mock("../src/testcaseStats", () => ({
    addStatsToCommit: addStatsToCommitMock
}));

import {run} from "../src/runner";

beforeEach(() => {
    jest.clearAllMocks();
    restore = mockedEnv({
        BUILDKITE_COMMIT: "0123456789",
    });
});
afterEach(() => {
    restore();
});

describe("When the runner is called", () => {
    it("should parse, add stats and send to slack", async (done) => {
        const actual = await run();
        expect(parseFilesMock).toHaveBeenCalled();
        expect(addStatsToCommitMock).toHaveBeenCalled();
        expect(sendResultToSlackMock).toHaveBeenCalled();
        done();
    });
});