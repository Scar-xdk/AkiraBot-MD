const { proto } = require("@whiskeysockets/baileys");

exports.execute = async (msg, sock, userId, { getDonos, setDonos }) => {
  const senderJid = msg.key.participant || msg.key.remoteJid;
  const sender = senderJid.replace(/[^0-9]/g, "");
  const { dono2, dono3 } = getDonos();

  // Somente o dono principal pode usar
  if (sender !== userId) {
    await sock.sendMessage(msg.key.remoteJid, {
      text: "Apenas o dono principal pode usar este comando.",
    });
    return;
  }

  let alvo;
  if (msg.message.extendedTextMessage?.contextInfo?.mentionedJid?.length) {
    alvo = msg.message.extendedTextMessage.contextInfo.mentionedJid[0];
  } else if (msg.message.extendedTextMessage?.contextInfo?.participant) {
    alvo = msg.message.extendedTextMessage.contextInfo.participant;
  } else if (msg.message.extendedTextMessage?.text) {
    const numeroTexto = msg.message.extendedTextMessage.text.replace(/[^0-9]/g, "");
    if (numeroTexto.length >= 10) alvo = numeroTexto + "@s.whatsapp.net";
  }

  if (!alvo) {
    await sock.sendMessage(msg.key.remoteJid, {
      text: "Marque ou responda alguém, ou envie o número para definir como Dono 3.",
    });
    return;
  }

  const numeroAlvo = alvo.replace(/[^0-9]/g, "");
  const novosDonos = { dono2, dono3: numeroAlvo };
  setDonos(novosDonos);

  await sock.sendMessage(msg.key.remoteJid, {
    text: `Dono 3 atualizado com sucesso: @${numeroAlvo}`,
    mentions: [alvo],
  });
};

