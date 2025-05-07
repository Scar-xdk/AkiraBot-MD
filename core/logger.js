const chalk = require("chalk");

function logMensagem({ usuario, grupo, mensagem, numero, isCommand }) {
  const tipoMensagem = isCommand
    ? chalk.cyan.bold("🛠️ COMANDO")
    : chalk.blueBright("💬 MENSAGEM");

  const user = usuario || "Desconhecido";
  const num = numero ? numero.replace(/@.+/, "") : "Indefinido";
  const grupoFormatado = grupo && grupo !== "Grupo" ? grupo : "Privado";

  const divider = chalk.gray("╔═══════════════════════════════════════╗");

  const textoFormatado = `
${chalk.redBright("╭═══════◇")}
${chalk.redBright("┃")} ${chalk.whiteBright.bold("『 AkiraBot-MD 』")}
${chalk.redBright("╰═══════◇")}

${divider}
${chalk.whiteBright("┃")} ${chalk.magenta("🥶 Usuário :")} ${chalk.white(user)}
${chalk.whiteBright("┃")} ${chalk.magenta("🥶 Grupo   :")} ${chalk.white(grupoFormatado)}
${chalk.whiteBright("┃")} ${chalk.magenta("🥶 Número  :")} ${chalk.white(num)}
${chalk.whiteBright("┃")} ${chalk.magenta("🥶 Tipo    :")} ${tipoMensagem}
${chalk.whiteBright("┃")} ${chalk.magenta("🥶 Mensagem:")}
${chalk.whiteBright("┃")} ${chalk.gray(mensagem.split("\n").join(`\n${chalk.whiteBright("┃")} `))}
${chalk.whiteBright("╚═══════════════════════════════════════╝")}
`;

  console.log(textoFormatado);
}

module.exports = {
  logMensagem,
};

