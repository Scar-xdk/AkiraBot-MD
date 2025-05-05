// commands/play.js
const fetch = require("node-fetch");

module.exports = {
  name: "play",
  description: "Baixa e envia música do YouTube.",
  category: "music",
  async execute(sock, m, args) {
    const text = args.join(" ");
    if (!text)
      return sock.sendMessage(m.key.remoteJid, { text: "❌ Use: play nome da música ou link" }, { quoted: m });

    try {
      await sock.sendMessage(m.key.remoteJid, { text: "🔍 Buscando música..." }, { quoted: m });

      const busca = await fetch(`https://vihangayt.me/search?q=${encodeURIComponent(text)}`);
      const resultado = await busca.json();
      const video = resultado.data[0];

      const down = await fetch(`https://vihangayt.me/download/ytmp3?url=${video.url}`);
      const musica = await down.json();

      const info = `🎵 *Título:* ${video.title}\n🕒 *Duração:* ${video.duration}\n🎧 *Qualidade:* ${musica.data.quality}`;

      await sock.sendMessage(m.key.remoteJid, {
        audio: { url: musica.data.url },
        mimetype: "audio/mpeg",
        fileName: `${video.title}.mp3`,
        caption: info
      }, { quoted: m });

    } catch (e) {
      console.error(e);
      sock.sendMessage(m.key.remoteJid, { text: "❌ Erro ao baixar música." }, { quoted: m });
    }
  }
};
