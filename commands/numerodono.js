const fs = require("fs");
const path = require("path");

const donosPath = path.join(__dirname, "..", "assets", "donos.json");

function salvarDonos(dados) {
  fs.writeFileSync(donosPath, JSON.stringify(dados, null, 2));
}

function carregarDonos() {
  if (!fs.existsSync(donosPath)) return {};
  return JSON.parse(fs.readFileSync(donosPath));
}

exports.execute = async (sock, msg, args) => {
  const sender = msg.key.remoteJid.includes("@g.us") ? msg.key.participant : msg.key.remoteJid;
  const numeroConectado = sock.user.id.split(":")[0].replace(/[^0-9]/g, "");
  const numeroSender = sender.replace(/[^0-9]/g, "");

  if (numeroConectado !== numeroSender) {
    await sock.sendMessage(msg.key.remoteJid, { text: "Apenas o número conectado pode definir o dono principal." });
    return;
  }

  const novoNumero = args[0]?.replace(/[^0-9]/g, "");
  if (!novoNumero) {
    await sock.sendMessage(msg.key.remoteJid, { text: "Use: numerodono +55XXXXXXXXXXX" });
    return;
  }

  const dados = carregarDonos();
  dados.numerodono = `+${novoNumero}`;
  salvarDonos(dados);

  await sock.sendMessage(msg.key.remoteJid, { text: `Número dono atualizado com sucesso: +${novoNumero}\nUse !donos para visualizar.` });
};

