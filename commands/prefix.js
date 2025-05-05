const { setPrefix } = require("../core/prefixManager");

module.exports = {
  name: "prefix",
  execute: async (sock, msg, args) => {
    const novo = args[0];
    if (!novo) {
      await sock.sendMessage(msg.key.remoteJid, { text: "Informe um novo prefixo." });
      return;
    }
    setPrefix(novo);
    await sock.sendMessage(msg.key.remoteJid, { text: `Prefixo alterado para: ${novo}` });
  },
};

