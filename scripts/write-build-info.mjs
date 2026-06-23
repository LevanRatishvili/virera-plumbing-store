import { mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

const pkg = JSON.parse(readFileSync("package.json", "utf8"));
const info = {
  appName: pkg.name,
  commit: process.env.RENDER_GIT_COMMIT || process.env.GITHUB_SHA || git(["rev-parse", "HEAD"]),
  branch: process.env.RENDER_GIT_BRANCH || process.env.GITHUB_REF_NAME || git(["branch", "--show-current"]) || "main",
  appVersion: pkg.version,
  version: pkg.version,
  buildTime: new Date().toISOString(),
  environment: process.env.NODE_ENV || (process.env.RENDER_GIT_COMMIT ? "production" : "development")
};
info.shortCommit = info.commit.slice(0, 7);

mkdirSync("public", { recursive: true });
writeFileSync(".build-info.json", `${JSON.stringify(info, null, 2)}\n`);
writeFileSync("public/build-info.json", `${JSON.stringify({
  appName: info.appName,
  appVersion: info.appVersion,
  commit: info.commit,
  shortCommit: info.shortCommit,
  branch: info.branch,
  buildTime: info.buildTime,
  environment: info.environment
}, null, 2)}\n`);
console.log(`Wrote build info for ${info.commit}`);

function git(args) {
  const result = spawnSync("git", args, { encoding: "utf8" });
  return result.status === 0 ? result.stdout.trim() : "";
}
