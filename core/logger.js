function logMensagem({ usuario, grupo, mensagem, numero }) {
  const output = `
╔═══ 『 ZETSU BOT 』 ═══╗
⚜️ ~ Usuário  : ${usuario}
💯 ~ Grupo   : ${grupo}
✨️ ~ Mensagem : ${mensagem}
🔰 ~ Número   : ${numero}
╚══════════════════╝
`;
  console.log(output);
}

module.exports = { logMensagem };