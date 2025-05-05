module.exports = {
  name: 'rebaixar',
  description: 'Remove o cargo de administrador de um membro',
  async execute(sock, msg) {
    const { remoteJid } = msg.key;

    if (!remoteJid.endsWith('@g.us')) {
      return sock.sendMessage(remoteJid, { text: 'Comando só funciona em grupos.' });
    }

    const groupMetadata = await sock.groupMetadata(remoteJid);
    const groupAdmins = groupMetadata.participants.filter(p => p.admin).map(p => p.id);
    const botNumber = (await sock.user.id.split(':'))[0] + '@s.whatsapp.net';

    if (!groupAdmins.includes(botNumber)) {
      return sock.sendMessage(remoteJid, { text: 'Preciso ser admin para rebaixar alguém.' });
    }

    let target =
      msg.message?.extendedTextMessage?.contextInfo?.participant ||
      msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];

    if (!target) {
      return sock.sendMessage(remoteJid, { text: 'Marque ou responda a pessoa para rebaixar.' });
    }

    if (!groupAdmins.includes(target)) {
      return sock.sendMessage(remoteJid, { text: 'Usuário já é um membro comum.' });
    }

    await sock.groupParticipantsUpdate(remoteJid, [target], 'demote');
    await sock.sendMessage(remoteJid, { text: `Usuário rebaixado com sucesso: @${target.split('@')[0]}`, mentions: [target] });
  }
};

