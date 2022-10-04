# JUnit - slack notification buildkite plugin

This project has a new home in [iress/junit-slack-notification-buildkite-plugin](https://github.com/iress/junit-slack-notification-buildkite-plugin)

## Example

Add a extra step like this after running your tests to your `pipeline.yml`:
```yml
steps:
  - label: Run tests
    key: my-test
    command: ...
    
  - label: ":slack: :memo: to #junit_bot_testing"
    depends_on: my-test
    allow_dependency_failure: true
    plugins:
      - iress/junit-slack-notification#v1.0.0:
          artifacts: "**/*.xml"
          SLACK_TOKEN: "xoxb-xxxxxxxxxxx-xxxxxxxxxxxxx-xxxxxxxxxxxxxxxxxxxxxxxx"
          SLACK_CHANNEL: "#junit_bot_testing"
```
