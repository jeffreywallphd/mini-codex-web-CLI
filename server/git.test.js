const test = require("node:test");
const assert = require("node:assert/strict");

const { buildSpawnContext, formatCommand, parseStatusEntries } = require("./git");

test("formatCommand quotes arguments that need escaping", () => {
  assert.equal(
    formatCommand("codex", ["exec", "--sandbox", "workspace-write", "fix README.md"]),
    'codex exec --sandbox workspace-write "fix README.md"'
  );
});

test("non-windows codex commands are logged directly", () => {
  const originalPlatform = process.platform;
  Object.defineProperty(process, "platform", { value: "linux" });

  try {
    const result = buildSpawnContext("codex", ["exec", "hello world"]);
    assert.equal(result.actualCommand, "codex");
    assert.deepEqual(result.actualArgs, ["exec", "hello world"]);
    assert.equal(result.executedCommand, 'codex exec "hello world"');
    assert.equal(result.spawnCommand, 'codex exec "hello world"');
  } finally {
    Object.defineProperty(process, "platform", { value: originalPlatform });
  }
});

test("windows codex commands log both requested and cmd.exe wrapped forms", () => {
  const originalPlatform = process.platform;
  Object.defineProperty(process, "platform", { value: "win32" });

  try {
    const result = buildSpawnContext("codex", ["exec", "--full-auto", "hello world"]);
    assert.equal(result.actualCommand, "cmd.exe");
    assert.deepEqual(result.actualArgs, [
      "/d",
      "/s",
      "/c",
      'codex exec --full-auto "hello world"'
    ]);
    assert.equal(result.executedCommand, 'codex exec --full-auto "hello world"');
    assert.equal(
      result.spawnCommand,
      'cmd.exe /d /s /c "codex exec --full-auto \\"hello world\\""'
    );
  } finally {
    Object.defineProperty(process, "platform", { value: originalPlatform });
  }
});

test("git status porcelain output is parsed into clickable file entries", () => {
  const files = parseStatusEntries(`## codex-123\n M web/app.js\n?? web/run-details.js\nR  old.js -> new.js`);

  assert.deepEqual(files, [
    {
      indexStatus: " ",
      workTreeStatus: "M",
      path: "web/app.js",
      rawPath: "web/app.js"
    },
    {
      indexStatus: "?",
      workTreeStatus: "?",
      path: "web/run-details.js",
      rawPath: "web/run-details.js"
    },
    {
      indexStatus: "R",
      workTreeStatus: " ",
      path: "new.js",
      rawPath: "old.js -> new.js"
    }
  ]);
});
