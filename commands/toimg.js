const fs = require("fs");
const path = require("path");
const { downloadMediaMessage } = require("@whiskeysockets/baileys");

exports.execute = async (sock, msg, args, { getPrefix }) => {
  const prefix = getPrefix();
  const from = msg.key.remoteJid;
  const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;

  if (!quoted || !quoted.stickerMessage) {
    return sock.sendMessage(from, { text: `Responda a figurinha com \`${prefix}toimg\`` });
  }

  try {
    const buffer = await downloadMediaMessage(
      { message: quoted },
      "buffer",
      {},
      { reuploadRequest: sock.updateMediaMessage }
    );

    const filePath = path.join(__dirname, "..", "temp", `sticker_${Date.now()}.jpg`);
    fs.writeFileSync(filePath, buffer);

    await sock.sendMessage(from, {
      image: fs.readFileSync(filePath),
      caption: "Aqui está sua figurinha convertida em imagem."
    }, { quoted: msg });

    fs.unlinkSync(filePath);
  } catch (err) {
    console.error(err);
    await sock.sendMessage(from, { text: "Erro ao converter figurinha para imagem." });
  }
};

