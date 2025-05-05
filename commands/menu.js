const { readFileSync } = require("fs");
const path = require("path");
const moment = require("moment-timezone");
moment.tz.setDefault("America/Sao_Paulo");

const saudacao = () => {
  const hora = moment().hour();
  if (hora >= 5 && hora < 12) return "Bom dia";
  if (hora >= 12 && hora < 18) return "Boa tarde";
  return "Boa noite";
};

exports.execute = async (sock, msg, args, { getPrefix }) => {
  const prefix = getPrefix();
  const nome = msg.pushName || "Usuário";
  const numero = msg.key.participant || msg.key.remoteJid;
  const imagemMenu = readFileSync(path.join(__dirname, "..", "assets", "menu.jpg"));

  const texto = `
╔═━━━✦『 ZETSUBOT 』✦━━━═╗
┃ ${saudacao()}, @${nome.split("@")[0]}
┃ 
┃ ╭──『 MENU MEMBROS 』──╮
┃ │ 🌸︎ ${prefix}s
┃ │ 🌸︎ ${prefix}ping
┃ │ 🌸︎ ${prefix}dono
┃ │ 🌸︎ ${prefix}toimg
┃ │ 🌸︎ ${prefix}criador
┃ │ 🌸︎ ${prefix}menuadm
┃ │ 🌸︎ 
┃ ╰──────────────╯
╚═══════════════════════╝`;

  await sock.sendMessage(msg.key.remoteJid, {
    image: imagemMenu,
    caption: texto,
    mentions: [numero],
  });
};
