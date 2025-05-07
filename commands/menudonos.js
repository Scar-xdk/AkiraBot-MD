
const fs = require("fs");
const path = require("path");
const donosPath = path.join(__dirname, "..", "assets", "donos.json");
const fotoPath = path.join(__dirname, "..", "assets", "donos.jpg"); // Caminho da foto

module.exports = {
  name: "menudonos",
  description: "Exibe os donos configurados do bot.",
  async execute(sock, msg) {
    if (!fs.existsSync(donosPath)) {
      return sock.sendMessage(msg.key.remoteJid, {
        text: "Arquivo donos.json não encontrado.",
      });
    }

    const donos = JSON.parse(fs.readFileSync(donosPath));

    const menu = `╭───『 *𝑫𝑶𝑵𝑶 𝑩𝑶𝑻* 』
│
├ ✦ 👑𝑵𝑼́𝑴𝑫𝑶𝑵𝑶: ${donos.numerodono || "Não configurado"}
├ ✦ 🎗𝑫𝑶𝑵𝑶 2: ${donos.dono2 || "Não configurado"}
└ ✦ 👾𝑫𝑶𝑵𝑶 3: ${donos.dono3 || "Não configurado"}`;

    // Verifica se a foto existe
    if (fs.existsSync(fotoPath)) {
      await sock.sendMessage(msg.key.remoteJid, {
        image: fs.readFileSync(fotoPath), // Envia a imagem
        caption: menu, // Envia o menu como legenda
      });
    } else {
      // Caso a foto não exista, envia apenas o texto
      await sock.sendMessage(msg.key.remoteJid, {
        text: menu,
      });
    }
  },
};

