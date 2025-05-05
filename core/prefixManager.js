// core/prefixManager.js
const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "prefixo.json");

const getPrefix = () => {
  if (!fs.existsSync(filePath)) return "!";
  const data = JSON.parse(fs.readFileSync(filePath));
  return data.prefix || "!";
};

const setPrefix = (novoPrefixo) => {
  fs.writeFileSync(filePath, JSON.stringify({ prefix: novoPrefixo }, null, 2));
};

module.exports = { getPrefix, setPrefix };

