const fs = require("fs");
const path = require("path");

module.exports = {
  name: "antispam1",
  description: "Ativa o antispam com limite de mensagens repetidas antes de banir.",
  category: "moderação",
  async execute(m, sock, args, { groupMetadata }) {
    if (!m.isGroup) return sock.sendMessage(m.chat, { text: "Este comando só funciona em grupos." }, { quoted: m });

    const metadataPath = path.join(__dirname, "..", "assets", "antispam.json");

    let antispam = {};
    if (fs.existsSync(metadataPath)) {
      antispam = JSON.parse(fs.readFileSync(metadataPath));
    }

    if (!m.isGroupAdmin) return sock.sendMessage(m.chat, { text: "Apenas admins podem usar este comando." }, { quoted: m });

    const limite = parseInt(args[0]);
    if (!limite || isNaN(limite)) {
      return sock.sendMessage(m.chat, { text: "Use: antispam1 5 (onde 5 é o limite de mensagens repetidas)" }, { quoted: m });
    }

    antispam[m.chat] = { ativo: true, limite };
    fs.writeFileSync(metadataPath, JSON.stringify(antispam, null, 2));
    return sock.sendMessage(m.chat, { text: `Antispam ativado com limite de ${limite} mensagens.` }, { quoted: m });
  },
};

