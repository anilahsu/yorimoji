import fs from "fs";
import path from "path";

const sourceDir = path.join(__dirname, "../node_modules/kuromoji/dict");
const targetDir = path.join(__dirname, "../public/dict");

// Create target directory if it doesn't exist
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// Copy all .dat.gz files
fs.readdirSync(sourceDir)
  .filter((file) => file.endsWith(".dat.gz"))
  .forEach((file) => {
    fs.copyFileSync(path.join(sourceDir, file), path.join(targetDir, file));
  });

console.log("Dictionary files copied successfully!");
