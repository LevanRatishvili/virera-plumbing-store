import { writeFileSync, readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

const pkg = JSON.parse(readFileSync("package.json", "utf8"));
const info = {
  commit: process.env.RENDER_GIT_COMMIT || process.env.GITHUB_SHA || git(["rev-parse", "HEAD"]),
  branch: process.env.RENDER_GIT_BRANCH || process.env.GITHUB_REF_NAME || git(["branch", "--show-current"]) || "main",
  version: pkg.version,
  buildTime: new Date().toISOString()
};

writeFileSync(".build-info.json", `${JSON.stringify(info, null, 2)}\n`);
console.log(`Wrote .build-info.json for ${info.commit}`);

function git(args) {
  const result = spawnSync("git", args, { encoding: "utf8" });
  return result.status === 0 ? result.stdout.trim() : "";
}
