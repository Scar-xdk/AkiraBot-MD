module.exports = {
  name: 'ban',
  description: 'Bane o usuário mencionado ou respondido do grupo',
  category: 'admin',
  async execute(sock, m, args) {
    const isGroup = m.key.remoteJid.endsWith('@g.us');
    if (!isGroup) return sock.sendMessage(m.key.remoteJid, { text: '❌ Este comando só funciona em grupos.' }, { quoted: m });

    const groupMetadata = await sock.groupMetadata(m.key.remoteJid);
    const botNumber = sock.user.id.split(':')[0] + '@s.whatsapp.net';
    const botIsAdmin = groupMetadata.participants.some(p => p.id === botNumber && p.admin);
    if (!botIsAdmin) return sock.sendMessage(m.key.remoteJid, { text: '❌ Eu preciso ser admin para banir membros.' }, { quoted: m });

    let target;
    if (m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0]) {
      target = m.message.extendedTextMessage.contextInfo.mentionedJid[0];
    } else if (m.message?.extendedTextMessage?.contextInfo?.participant) {
      target = m.message.extendedTextMessage.contextInfo.participant;
    }

    if (!target) return sock.sendMessage(m.key.remoteJid, { text: '❌ Marque ou responda alguém para banir.' }, { quoted: m });

    const motivo = args.join(" ") || "Usuário banido por violar as regras.";

    try {
      await sock.sendMessage(m.key.remoteJid, {
        text: `@${target.split('@')[0]} banido, com sucesso! - por motivos justos.🌀`,
        mentions: [target]
      }, { quoted: m });

      await sock.groupParticipantsUpdate(m.key.remoteJid, [target], 'remove');
    } catch (err) {
      console.error('Erro ao banir:', err);
      await sock.sendMessage(m.key.remoteJid, { text: '❌ Erro ao tentar banir o usuário.' }, { quoted: m });
    }
  }
};
