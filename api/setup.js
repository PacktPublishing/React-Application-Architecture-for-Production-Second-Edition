import { execSync } from "node:child_process";
import { writeFileSync } from "node:fs";

const chapter = process.argv[2];

if (!chapter) {
  console.error("Usage: node setup.js <chapter-number> (05-12)");
  process.exit(1);
}

if (!/^(?:0[5-9]|1[0-2])$/.test(chapter)) {
  console.error("Error: chapter must be 05 through 12");
  process.exit(1);
}

console.log(`Setting up API for chapter ${chapter}...`);

execSync("npm install", { stdio: "inherit" });

const bypassAuthLine = (chapter === "05" || chapter === "06") ? `\nBYPASS_AUTH=true` : "";

const env = `NODE_ENV=development
PORT=9999
LOG_LEVEL=debug
DATABASE_URL=file:dev.db
CLIENT_URL=http://localhost:5173
JWT_SECRET=019aa5cd${bypassAuthLine}
`;

writeFileSync(".env", env);

console.log(".env written.");
console.log("Done.");
