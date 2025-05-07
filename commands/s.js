const fs = require("fs");
const path = require("path");
const { downloadMediaMessage } = require("@whiskeysockets/baileys");
const { exec } = require("child_process");
const { tmpdir } = require("os");

const progressBar = (progress) => {
  const total = 10;
  const filled = "█".repeat(progress);
  const empty = "▒".repeat(total - progress);
  return `${filled}${empty} ${progress * 10}%`;
};

exports.execute = async (sock, m) => {
  try {
    const quoted = m.message?.extendedTextMessage?.contextInfo?.quotedMessage || m.message;
    const type = Object.keys(quoted || {})[0];
    const mime = quoted?.[type]?.mimetype || "";

    if (!mime.startsWith("image/")) {
      return sock.sendMessage(m.key.remoteJid, { text: "Responda a uma imagem para criar a figurinha!" }, { quoted: m });
    }

    const mediaBuffer = await downloadMediaMessage({ message: quoted }, 'buffer');
    const inputPath = path.join(tmpdir(), `img_${Date.now()}.jpg`);
    const rawWebpPath = path.join(tmpdir(), `raw_${Date.now()}.webp`);
    const finalStickerPath = path.join(tmpdir(), `sticker_${Date.now()}.webp`);

    fs.writeFileSync(inputPath, mediaBuffer);

    let progress = 0;
    const barra = await sock.sendMessage(m.key.remoteJid, { text: progressBar(progress) }, { quoted: m });

    const updateProgress = async (newProgress) => {
      progress = newProgress;
      await sock.sendMessage(m.key.remoteJid, { text: progressBar(progress), edit: barra.key }, { quoted: m });
    };

    // Barra de progresso 30%
    await updateProgress(3);
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Barra de progresso 60%
    await updateProgress(6);
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Barra de progresso 90%
    await updateProgress(9);
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Barra de progresso 100%
    await updateProgress(10);

    // Convertendo imagem para WebP
    await new Promise((resolve, reject) => {
      exec(`ffmpeg -i "${inputPath}" -vf "scale=512:512:force_original_aspect_ratio=decrease" -vframes 1 "${rawWebpPath}"`, (err) => {
        if (err) return reject(err);
        resolve();
      });
    });

    // Renomeando para finalStickerPath
    fs.renameSync(rawWebpPath, finalStickerPath);

    await sock.sendMessage(m.key.remoteJid, { sticker: { url: finalStickerPath } }, { quoted: m });

    fs.unlinkSync(inputPath);
    fs.unlinkSync(finalStickerPath);
  } catch (err) {
    console.error("Erro ao criar figurinha:", err);
    sock.sendMessage(m.key.remoteJid, { text: "Erro ao criar figurinha." }, { quoted: m });
  }
};

