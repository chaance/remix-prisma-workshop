const fs = require("fs/promises");
const cp = require("child_process");
const path = require("path");
const { getExerciseDirs, getFinalDirs } = require("./scripts/utils");

let args = process.argv.slice(2);
let appDir = args[0];

const resolvePath = (p) =>
  [...getExerciseDirs(), ...getFinalDirs()].find((dir) =>
    path.resolve(dir).startsWith(path.resolve(p))
  );

async function go() {
  appDir = resolvePath(appDir);
  // warn if the directory deosn't exist
  let stat = await fs.stat(appDir).catch(() => false);
  if (!stat) {
    console.log(`${appDir} does not exist`);
    return;
  }

  let [_dot, category, numberName] = appDir.split("/");
  let [number] = numberName.split("-");
  let PORT = { exercise: 4000, final: 5000 }[category] + Number(number);

  cp.spawn(`npm run dev`, {
    cwd: appDir,
    shell: true,
    stdio: "inherit",
    env: { PORT, ...process.env },
  });
}

go();
