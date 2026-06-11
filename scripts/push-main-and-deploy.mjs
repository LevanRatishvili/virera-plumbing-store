import { spawnSync } from "node:child_process";

const branch = runGit(["branch", "--show-current"]);
if (branch !== "main") {
  console.error(`Refusing to push/deploy from ${branch}. Switch to main first.`);
  process.exit(2);
}

run("git", ["push", "origin", "main"]);
run("npm", ["run", "deploy:render"]);

function run(command, args) {
  const result = spawnSync(command, args, { encoding: "utf8", stdio: "inherit", shell: process.platform === "win32" });
  if (result.status !== 0) process.exit(result.status || 1);
}

function runGit(args) {
  const result = spawnSync("git", args, { encoding: "utf8" });
  if (result.status !== 0) {
    throw new Error(`git ${args.join(" ")} failed: ${result.stderr || result.stdout}`);
  }
  return result.stdout.trim();
}
