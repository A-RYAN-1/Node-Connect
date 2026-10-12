// Copies the compiled ChatApp artifact into Context/ so the frontend uses
// the ABI of the contract in contracts/. Run with `npm run abi`.
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const source = path.join(root, "artifacts/contracts/ChatApp.sol/ChatApp.json");
const target = path.join(root, "Context/ChatApp.json");

fs.copyFileSync(source, target);
console.log(`Copied ${path.relative(root, source)} to ${path.relative(root, target)}`);
