// Adicionar no arquivo do comando !dono

module.exports = {
  name: 'dono', // Nome do comando
  description: 'Exibe informações sobre o dono do bot',
  async execute(sock, msg, args) {
    const donoNome = 'By Dark';  // Nome do dono
    const donoNumero = '5534998769175';  // Número do dono

    const donoInfo = `
╭──────────────────────
┆🧸 ~ *Dono do Bot*    
┆ Nome: ${donoNome}  
┆ Número: ${donoNumero}
╰──────────────────────
    `;

    // Envia a mensagem com as informações do dono
    await sock.sendMessage(msg.key.remoteJid, { text: donoInfo });
  }
};

