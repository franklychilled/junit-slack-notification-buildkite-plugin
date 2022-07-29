import { parseFiles } from "./xmlParser";
import { describe, expect, xit } from "@jest/globals";

describe("Parser test read slack-notification/reports folder", () => {

  xit("should parse XML files with testcase results", async () => {
    const actual = await parseFiles();
    expect(actual).toStrictEqual([{
      "testsuites": {
        "$": {
          "errors": "0",
          "failures": "0",
          "tests": "1"
        },
        "testsuite": [
          {
            "$": {
              "errors": "0",
              "failures": "0",
              "hostname": "",
              "id": "",
              "name": "accessibility.login",
              "package": "accessibility",
              "skipped": "0",
              "tests": "1",
              "time": "4.557",
              "timestamp": ""
            },
            "testcase": [
              {
                "$": {
                  "assertions": "7",
                  "classname": "accessibility.login",
                  "name": "accessibility/login - Launch Login page",
                  "time": "4.557"
                }
              }
            ]
          }
        ]
      }
    }]);
    
  });
});

