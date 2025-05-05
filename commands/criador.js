exports.execute = async (sock, msg) => {
  const from = msg.key.remoteJid;
  const sender = msg.key.participant || msg.key.remoteJid;
  const numero = sender.split("@")[0];

  const texto = `
 ╭─── 𝐶𝑟𝑖𝑎𝑑𝑜𝑟 ⚡───╮
 ╽ ✘ 𝐵𝑦 𝐷𝑎𝑟𝑘
 ╿
 ╿ ☕︎ 𝐵𝑜𝑡 𝑍𝑒𝑡𝑠𝑢𝐵𝑜𝑡
 ╽
 ╿☘︎ 5534998769175
 ╽
 ╿ ◡̈Chame se houver duvida!
 ╽
 ╰───────────╯
`;

  try {
    for (let i = 0; i < 1; i++) {
      await sock.relayMessage(from, {
        requestPaymentMessage: {
          currencyCodeIso4217: "BRL",
          amount1000: "0",
          requestFrom: sender,
          noteMessage: {
            extendedTextMessage: {
              text: texto,
              contextInfo: {
                mentionedJid: [sender]
              }
            }
          },
          expiryTimestamp: "0"
        }
      }, {});
    }
  } catch (err) {
    console.error(err);
    await sock.sendMessage(from, {
      text: "Erro ao enviar mensagem do criador.",
      mentions: [sender]
    });
  }
};

