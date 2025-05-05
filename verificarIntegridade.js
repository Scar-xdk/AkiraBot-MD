const fs = require("fs");

function verificarIntegridade() {
  try {
    const conteudo = fs.readFileSync("./handleCommands.js", "utf-8");
    const criador = "5534998769175";

    if (!conteudo.includes(criador)) {
      console.log("PROTEÇÃO ATIVADA: Código modificado ou número do criador removido.");
      process.exit(1);
    }

  } catch (e) {
    console.log("Erro ao verificar integridade:", e.message);
    process.exit(1);
  }
}

module.exports = { verificarIntegridade };
