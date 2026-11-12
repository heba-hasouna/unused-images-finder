const fs = require("fs");
const path = require("path");

const imagesFolder = process.argv[2];
const codeFolder = process.argv[3];
const shouldDelete = process.argv.includes("--delete");

const images = fs.readdirSync(imagesFolder);

const codeFiles = fs
  .readdirSync(codeFolder, { recursive: true })
  .filter((f) => f.endsWith(".tsx") || f.endsWith(".ts") || f.endsWith(".css"));

const allCode = codeFiles
  .map((f) => fs.readFileSync(path.join(codeFolder, f), "utf8"))
  .join("\n");

const unused = images.filter((image) => !allCode.includes(image));

function getTotalSize(fileNames) {
  let total = 0;
  for (const name of fileNames) {
    const fullPath = path.join(imagesFolder, name);
    total += fs.statSync(fullPath).size;
  }
  return total;
}

const allSize = getTotalSize(images);
const unusedSize = getTotalSize(unused);
const toMB = (bytes) => (bytes / 1024 / 1024).toFixed(2) + " MB";

console.log("Images: " + images.length);
console.log("Unused: " + unused.length);
console.log(unused);
console.log("Total size: " + toMB(allSize));
console.log("Unused size: " + toMB(unusedSize));
console.log("After cleanup: " + toMB(allSize - unusedSize));

if (shouldDelete) {
  for (const name of unused) {
    fs.unlinkSync(path.join(imagesFolder, name));
    console.log("Deleted: " + name);
  }
  console.log("Done. Deleted " + unused.length + " images.");
} else {
  console.log("Nothing deleted. Add --delete to remove the unused images.");
}