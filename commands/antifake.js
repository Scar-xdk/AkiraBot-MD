const fs = require("fs");
const path = require("path");

module.exports = {
  name: "antifake",
  description: "Ativa ou desativa o antifake que bane números fora do Brasil (começando sem +55)",
  category: "moderação",
  async execute(m, sock, args, { groupMetadata }) {
    if (!m.isGroup) return sock.sendMessage(m.chat, { text: "Este comando só funciona em grupos." }, { quoted: m });

    const metadataPath = path.join(__dirname, "..", "assets", "antifake.json");

    let antifake = {};
    if (fs.existsSync(metadataPath)) {
      antifake = JSON.parse(fs.readFileSync(metadataPath));
    }

    if (!m.isGroupAdmin) return sock.sendMessage(m.chat, { text: "Apenas admins podem usar este comando." }, { quoted: m });

    const status = args[0];
    if (status === "1") {
      antifake[m.chat] = true;
      fs.writeFileSync(metadataPath, JSON.stringify(antifake, null, 2));
      return sock.sendMessage(m.chat, { text: "Antifake ativado. Números que não começarem com +55 serão banidos!" }, { quoted: m });
    } else if (status === "0") {
      antifake[m.chat] = false;
      fs.writeFileSync(metadataPath, JSON.stringify(antifake, null, 2));
      return sock.sendMessage(m.chat, { text: "Antifake desativado." }, { quoted: m });
    } else {
      return sock.sendMessage(m.chat, { text: "Use: antifake 1 (ativa) ou antifake 0 (desativa)" }, { quoted: m });
    }
  },
};

