const { getGroupMetadata } = require('@whiskeysockets/baileys');

module.exports = {
    name: 'marcar',
    async execute(sock, m, args) {
        const metadata = await sock.groupMetadata(m.key.remoteJid);
        const participantes = metadata.participants.map(p => p.id);

        await sock.sendMessage(m.key.remoteJid, {
            text: 'Acorda bando de dorminhocos🙈',
            mentions: participantes
        }, { quoted: m });
    }
};

