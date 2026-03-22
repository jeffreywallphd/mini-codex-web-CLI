const test = require("node:test");
const assert = require("node:assert/strict");

const {
  EXECUTION_MODE_OPTIONS,
  buildThreadOptions,
  formatUsageSummary,
  normalizePrompt
} = require("./codexRunner");

test("execution mode options only add sandboxing for write mode", () => {
  assert.deepEqual(EXECUTION_MODE_OPTIONS.read, {});
  assert.deepEqual(EXECUTION_MODE_OPTIONS.write, {
    sandboxMode: "workspace-write",
    approvalPolicy: "on-failure"
  });
});

test("prompts are normalized before being passed to the sdk", () => {
  assert.equal(normalizePrompt("  review base branch safety  "), "review base branch safety");
  assert.equal(normalizePrompt("   "), "");
});

test("sdk thread options match the requested execution mode", () => {
  assert.deepEqual(buildThreadOptions("/tmp/repo", "read"), {
    workingDirectory: "/tmp/repo"
  });
  assert.deepEqual(buildThreadOptions("/tmp/repo", "write"), {
    workingDirectory: "/tmp/repo",
    sandboxMode: "workspace-write",
    approvalPolicy: "on-failure"
  });
});

test("usage summaries prefer token counts when available", () => {
  assert.equal(
    formatUsageSummary({ input_tokens: 11, output_tokens: 7, total_tokens: 18 }),
    "input=11, output=7, total=18"
  );
  assert.equal(formatUsageSummary({ total_cost_usd: 0.12 }), '{"total_cost_usd":0.12}');
  assert.equal(formatUsageSummary(null), null);
});
