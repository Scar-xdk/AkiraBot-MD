const fs = require("fs");
const path = require("path");

exports.execute = async (sock, msg, args, { prefix, nomeBot, numerodono, dono2, dono3 }) => {
  const sender = msg.key.participant || msg.key.remoteJid;
  const senderNumber = sender.replace(/[^0-9]/g, "");

  // Apenas donos podem acessar
  if (![numerodono, dono2, dono3].includes(senderNumber)) {
    return sock.sendMessage(msg.key.remoteJid, {
      text: "⚠️ Apenas donos têm acesso a este menu."
    });
  }

  const texto = `
╭━━━『 ${nomeBot} ᭄ • Menu Dono 』
┃
┃ ⚜️ ${prefix}prefixo-bot
┃ ⚜️ ${prefix}nome-bot
┃ ⚜️ ${prefix}dono2
┃ ⚜️ ${prefix}dono3 
┃ ⚜️ ${prefix}fotomenu
┃ ⚜️ ${prefix}desconhecida
┃ ⚜️
╰━━━━━━━━━━━━╯
`;

  const imagePath = path.join(__dirname, "..", "assets", "menu.jpg");
  const buffer = fs.existsSync(imagePath) ? fs.readFileSync(imagePath) : null;

  if (buffer) {
    await sock.sendMessage(msg.key.remoteJid, {
      image: buffer,
      caption: texto
    });
  } else {
    await sock.sendMessage(msg.key.remoteJid, { text: texto });
  }
};
