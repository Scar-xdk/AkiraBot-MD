exports.execute = async (sock, msg, args) => {
  const from = msg.key.remoteJid;
  const sender = msg.key.participant || msg.key.remoteJid;

  const isGroup = from.endsWith("@g.us");
  if (!isGroup) return await sock.sendMessage(from, { text: "Este comando só pode ser usado em grupos!" });

  const metadata = await sock.groupMetadata(from);
  const isAdmin = metadata.participants.find(p => p.id === sender)?.admin;

  if (!isAdmin) {
    return await sock.sendMessage(from, { text: "Apenas administradores podem usar este comando!" });
  }

  const tipo = args[0];

  if (tipo === "a") {
    await sock.groupSettingUpdate(from, "not_announcement"); // abre o grupo
    return await sock.sendMessage(from, { text: "*Grupo aberto.* *Agora vamos interagir.*👾" });
  } else if (tipo === "f") {
    await sock.groupSettingUpdate(from, "announcement"); // fecha o grupo
    return await sock.sendMessage(from, { text: "*😉Grupo fechado* *Boa noite a Todos.*" });
  } else {
    return await sock.sendMessage(from, { text: "Use o comando assim:\n`grupo a` para abrir\n`grupo f` para fechar" });
  }
};

