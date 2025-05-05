const fs = require("fs");
const path = require("path");
const { downloadMediaMessage } = require("@whiskeysockets/baileys");

exports.execute = async (sock, msg) => {
  const quotedMsg = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;

  if (!quotedMsg?.imageMessage) {
    await sock.sendMessage(msg.key.remoteJid, {
      text: "Responda a uma imagem com o comando *fotomenu*.",
    });
    return;
  }

  const buffer = await downloadMediaMessage(
    { message: quotedMsg },
    "buffer",
    {},
    { logger: console, reuploadRequest: sock.updateMediaMessage }
  );

  const imagePath = path.join(__dirname, "../assets/menu.jpg");
  fs.writeFileSync(imagePath, buffer);

  await sock.sendMessage(msg.key.remoteJid, {
    text: "Foto do menu atualizada com sucesso!",
  });
};
