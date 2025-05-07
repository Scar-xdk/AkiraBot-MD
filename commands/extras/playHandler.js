const fetch = require("node-fetch");
const yts = require("yt-search");
const ytdl = require("ytdl-core");
const fs = require("fs");
const { fromBuffer } = require("file-type");

module.exports = async (sock, m) => {
  try {
    if (!m.message || !m.message.conversation && !m.message.extendedTextMessage) return;

    const text = m.message.conversation || m.message.extendedTextMessage?.text || "";
    const comando = text.toLowerCase().startsWith("!play") ? text.slice(5).trim() : null;
    if (!comando) return;

    const { key, pushName, remoteJid } = m;
    const from = m.key.remoteJid;

    if (!comando) return await sock.sendMessage(from, { text: "Digite o nome da música. Ex: !play faded" }, { quoted: m });

    const search = await yts(comando);
    const song = search.videos[0];
    if (!song) return await sock.sendMessage(from, { text: "Nenhum resultado encontrado." }, { quoted: m });

    const { title, url, timestamp, author, image } = song;

    const thumbBuffer = await (await fetch(image)).arrayBuffer();
    const thumb = Buffer.from(thumbBuffer);

    await sock.sendMessage(from, {
      image: thumb,
      caption: `*Música Encontrada:*\n\n*Título:* ${title}\n*Duração:* ${timestamp}\n*Autor:* ${author.name}`,
    }, { quoted: m });

    const stream = ytdl(url, { filter: "audioonly" });
    const filePath = `temp_${Date.now()}.mp4`;
    const writable = fs.createWriteStream(filePath);

    stream.pipe(writable);
    stream.on("end", async () => {
      const audioBuffer = fs.readFileSync(filePath);
      await sock.sendMessage(from, {
        audio: audioBuffer,
        mimetype: "audio/mp4",
        ptt: true
      }, { quoted: m });

      fs.unlinkSync(filePath);
    });

    stream.on("error", async () => {
      await sock.sendMessage(from, { text: "Erro ao baixar a música." }, { quoted: m });
    });
  } catch (e) {
    console.error("Erro no comando play:", e);
  }
};

