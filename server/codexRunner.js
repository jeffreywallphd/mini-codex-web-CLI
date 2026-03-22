const EXECUTION_MODE_OPTIONS = {
  read: {},
  write: {
    sandboxMode: "workspace-write",
    approvalPolicy: "on-failure"
  }
};

let codexSdkModulePromise;

function normalizePrompt(prompt) {
  return typeof prompt === "string" ? prompt.trim() : "";
}

function buildThreadOptions(repoPath, executionMode = "read") {
  return {
    workingDirectory: repoPath,
    ...(EXECUTION_MODE_OPTIONS[executionMode] || EXECUTION_MODE_OPTIONS.read)
  };
}

function formatUsageSummary(usage) {
  if (!usage || typeof usage !== "object") {
    return null;
  }

  const parts = [];

  if (typeof usage.input_tokens === "number") {
    parts.push(`input=${usage.input_tokens}`);
  }

  if (typeof usage.output_tokens === "number") {
    parts.push(`output=${usage.output_tokens}`);
  }

  if (typeof usage.total_tokens === "number") {
    parts.push(`total=${usage.total_tokens}`);
  }

  if (parts.length > 0) {
    return parts.join(", ");
  }

  return JSON.stringify(usage);
}

async function loadCodexSdk() {
  codexSdkModulePromise ||= import("@openai/codex-sdk");
  return codexSdkModulePromise;
}

async function runCodexWithSdk(repoPath, prompt, executionMode = "read") {
  const { Codex } = await loadCodexSdk();
  const codex = new Codex();
  const thread = codex.startThread(buildThreadOptions(repoPath, executionMode));
  const result = await thread.run(normalizePrompt(prompt));

  return {
    code: 0,
    stdout: result.finalResponse || "",
    stderr: "",
    executedCommand: null,
    spawnCommand: null,
    statusBefore: "Not captured when using @openai/codex-sdk.",
    statusAfter: "Not captured when using @openai/codex-sdk.",
    usageDelta: formatUsageSummary(result.usage),
    creditsRemaining: null,
    executionMode
  };
}

async function runCodexWithUsage(repoPath, prompt, executionMode = "read") {
  return runCodexWithSdk(repoPath, prompt, executionMode);
}

module.exports = {
  runCodexWithUsage,
  EXECUTION_MODE_OPTIONS,
  buildThreadOptions,
  formatUsageSummary,
  normalizePrompt
};
