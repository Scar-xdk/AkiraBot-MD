const fs = require("fs");
const path = require("path");
const { downloadMediaMessage } = require("@whiskeysockets/baileys");
const { writeExifImg } = require("../lib/exif"); // Arquivo que vamos criar

exports.execute = async (sock, msg, args, extras) => {
  const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
  const from = msg.key.remoteJid;

  if (!quoted || (!quoted.imageMessage && !quoted.viewOnceMessage?.message?.imageMessage)) {
    return sock.sendMessage(from, { text: "Responda a uma imagem com o comando." }, { quoted: msg });
  }

  const imgMsg = quoted.imageMessage || quoted.viewOnceMessage.message.imageMessage;
  const buffer = await downloadMediaMessage({ message: quoted }, "buffer", {}, { reuploadRequest: sock.updateMediaMessage });

  const stickerBuffer = await writeExifImg(buffer, { pack: "Zetsubot", author: "By Dark" });
  await sock.sendMessage(from, { sticker: stickerBuffer }, { quoted: msg });
};

