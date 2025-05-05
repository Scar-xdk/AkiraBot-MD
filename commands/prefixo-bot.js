exports.execute = async (sock, msg, args, { setPrefix }) => {
  const { remoteJid } = msg.key;
  const novoPrefixo = args[0];

  if (!novoPrefixo) {
    await sock.sendMessage(remoteJid, { text: "Uso: prefixo-bot !" });
    return;
  }

  setPrefix(novoPrefixo);
  await sock.sendMessage(remoteJid, { text: `Prefixo atualizado para: ${novoPrefixo}` });
};

