import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { spawnSync } from "node:child_process";

const configPath = resolve(".render-deploy.env");
if (existsSync(configPath)) {
  const lines = readFileSync(configPath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const separator = trimmed.indexOf("=");
    if (separator === -1) continue;
    const key = trimmed.slice(0, separator).trim();
    const value = trimmed.slice(separator + 1).trim();
    if (key && !process.env[key]) process.env[key] = value;
  }
}

const hookUrl = process.env.RENDER_DEPLOY_HOOK_URL;
if (!hookUrl) {
  console.error("Missing RENDER_DEPLOY_HOOK_URL. Add it to .render-deploy.env or the shell environment.");
  process.exit(2);
}

const branch = process.env.GIT_BRANCH || runGit(["branch", "--show-current"]);
if (branch !== "main") {
  console.log(`Skipping Render deploy hook because current branch is ${branch}.`);
  process.exit(0);
}

const localHead = runGit(["rev-parse", "HEAD"]);
const remoteHead = runGit(["ls-remote", "origin", "refs/heads/main"]).split(/\s+/)[0];
if (remoteHead && localHead !== remoteHead) {
  console.error(`Skipping Render deploy hook because local HEAD ${localHead} is not pushed to origin/main ${remoteHead}.`);
  process.exit(3);
}

console.log(`Triggering Render deploy hook for origin/main at ${localHead.slice(0, 12)}...`);
const response = await fetch(hookUrl, { method: "POST" });
if (!response.ok) {
  const detail = await response.text().catch(() => "");
  console.error(`Render deploy hook failed: HTTP ${response.status} ${response.statusText} ${detail}`.trim());
  process.exit(1);
}

console.log("Render deploy hook accepted.");

function runGit(args) {
  const result = spawnSync("git", args, { encoding: "utf8" });
  if (result.status !== 0) {
    throw new Error(`git ${args.join(" ")} failed: ${result.stderr || result.stdout}`);
  }
  return result.stdout.trim();
}
