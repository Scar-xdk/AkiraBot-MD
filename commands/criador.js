const fs = require("fs");
const path = require("path");

exports.execute = async (sock, msg) => {
  const sender = msg.key.participant || msg.key.remoteJid;
  const numero = sender.replace(/[^0-9]/g, "");

  const imagemPath = path.join(__dirname, "..", "assets", "menu.jpg");
  if (!fs.existsSync(imagemPath)) {
    await sock.sendMessage(msg.key.remoteJid, {
      text: "Imagem não encontrada. Coloque 'menu.jpg' dentro da pasta /assets.",
    });
    return;
  }

  const texto = `*Você conhece o #xdk?*\nEle é o criador desse sistema inteiro que você está usando!

*Em caso de dúvidas, fale com o criador:*
wa.me/5534998769175 (XDK)

⚠️ *Atenção:* Não é permitido vender este bot!`;

  await sock.sendMessage(msg.key.remoteJid, {
    image: { url: imagemPath },
    caption: texto,
    mentions: [sender],
  });
};

