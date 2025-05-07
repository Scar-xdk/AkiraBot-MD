const fs = require("fs");
const path = require("path");
const donosPath = path.join(__dirname, "..", "assets", "donos.json");
const fotoPath = path.join(__dirname, "..", "assets", "menu.jpg");
const criador = "+5534998769175"; // Número do criador, escondido para verificações de integridade

// Função para verificar a integridade do número do criador
const verificarIntegridade = () => {
  const LICENCA = criador;
  if (criador !== LICENCA) {
    console.log("Violação de integridade detectada! Encerrando o bot.");
    process.exit(1);
  }
};

module.exports = {
  name: "menu",
  description: "Exibe o menu do bot.",
  async execute(sock, msg) {
    verificarIntegridade();

    if (!fs.existsSync(donosPath)) {
      return sock.sendMessage(msg.key.remoteJid, {
        text: "Arquivo donos.json não encontrado.",
      });
    }

    const donos = JSON.parse(fs.readFileSync(donosPath));
    const numeroConectado = sock.user.id.split(":")[0].replace(/[^0-9]/g, "");
    const isDono = numeroConectado === donos.numerodono; // Verifica se o usuário é o dono

    // Menu Principal
    const menu = `╭───『 *MENU DO BOT* 』
│
├ ✦ Comandos Gerais:
├   ✦ toimg
├   ✦ menudonos
├   ✦ s
├   ✦ fig
├   ✦ criador
├   ✦ prefix
│
├───『 *MENU ADM* 』
├   ✦ promover
├   ✦ rebaixar
├   ✦ marcar
├   ✦ ban
├   ✦ grupo
├   ✦ criador
│
└───『 *MENU DONO* 』
├   ✦ prefixo-bot
├   ✦ oi
├   ✦ menuvip
├   ✦ antilink
├   ✦ antilinkgp
└──────`;

    // Envia o menu
    if (fs.existsSync(fotoPath)) {
      await sock.sendMessage(msg.key.remoteJid, {
        image: fs.readFileSync(fotoPath), // Envia a imagem
        caption: menu, // Envia o menu como legenda
      });
    } else {
      // Caso a foto não exista, envia apenas o texto
      await sock.sendMessage(msg.key.remoteJid, {
        text: menu,
      });
    }

    // Verifica se o usuário conectado é o dono
    if (isDono) {
      // Caso o número seja o dono, libere o menu dono
      return sock.sendMessage(msg.key.remoteJid, {
        text: "Você tem acesso ao Menu do Dono!",
      });
    } else {
      // Caso contrário, exibe mensagem de permissão restrita
      return sock.sendMessage(msg.key.remoteJid, {
        text: "Você não tem permissão para acessar o Menu do Dono.",
      });
    }
  },
};

