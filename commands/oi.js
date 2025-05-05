exports.execute = async (sock, msg, args) => {
  const sender = msg.key.participant || msg.key.remoteJid;
  const from = msg.key.remoteJid;
  const isGroup = from.endsWith("@g.us");

  if (!isGroup) {
    await sock.sendMessage(from, { text: "Este comando só funciona em grupos." });
    return;
  }

  const metadata = await sock.groupMetadata(from);
  const participantes = metadata.participants.map(p => p.id);

  // Mensagem com crase para multi-linha
  const aviso = args.length > 0 ? args.join(" ") : `Atenção Bot Novo na area!!
  ZetsuBot # chegando em breve👾.`;

  try {
    for (let i = 0; i < 3; i++) {
      await sock.relayMessage(from, {
        requestPaymentMessage: {
          currencyCodeIso4217: "BRL",
          amount1000: "0",
          requestFrom: sender,
          noteMessage: {
            extendedTextMessage: {
              text: aviso,
              contextInfo: {
                mentionedJid: participantes
              }
            }
          },
          expiryTimestamp: "0"
        }
      }, {});
    }
  } catch (err) {
    console.error(err);
    await sock.sendMessage(from, { text: "Erro ao enviar a mensagem paga." });
  }
};

