const path = require("path");
const fs = require("fs");

const FRONT_END_ADDRESS_FILE = path.resolve(__dirname, "../../frontend/src/constants/contractAddress.json");
const FRONT_END_ABI_FILE = path.resolve(__dirname, "../../frontend/src/constants/abi.json");

function checkFile(filePath) {
   if (fs.existsSync(filePath)) {
      console.log(`✅ File exists: ${filePath}`);
   } else {
      console.log(`❌ File NOT FOUND: ${filePath}`);
   }
}

console.log("🔍 Checking frontend constant files...\n");

checkFile(FRONT_END_ADDRESS_FILE);
checkFile(FRONT_END_ABI_FILE);
