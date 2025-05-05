exports.execute = async (sock, msg, args, { numerodono, setDonos, dono3 }) => {
  const sender = msg.key.participant || msg.key.remoteJid;
  const from = msg.key.remoteJid;

  if (!sender.includes(numerodono)) return sock.sendMessage(from, { text: "Apenas o dono principal pode definir subdonos." });

  let novo = args[0];
  if (msg.message.extendedTextMessage?.contextInfo?.mentionedJid?.length) {
    novo = msg.message.extendedTextMessage.contextInfo.mentionedJid[0].replace(/\D/g, "");
  } else if (novo) {
    novo = novo.replace(/\D/g, "");
  }

  if (!novo) return sock.sendMessage(from, { text: "Use: dono3 @usuário ou dono3 +55..." });

  setDonos(novo, dono3);
  sock.sendMessage(from, { text: `✅ Dono3 definido como: ${novo}` });
};
