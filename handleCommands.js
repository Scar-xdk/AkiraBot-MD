const fs = require("fs");
const path = require("path");
const { logMensagem } = require("./core/logger");

const getPrefix = () => {
  const filePath = path.join(__dirname, "core", "prefixo.json");
  if (!fs.existsSync(filePath)) return "!";
  return JSON.parse(fs.readFileSync(filePath)).prefix || "!";
};

const setPrefix = (novoPrefixo) => {
  const filePath = path.join(__dirname, "core", "prefixo.json");
  fs.writeFileSync(filePath, JSON.stringify({ prefix: novoPrefixo }, null, 2));
};

const getNomeBot = () => {
  const filePath = path.join(__dirname, "core", "nomebot.json");
  if (!fs.existsSync(filePath)) return "AkumaBot-MD";
  return JSON.parse(fs.readFileSync(filePath)).nome || "AkumaBot";
};

const setNomeBot = (novoNome) => {
  const filePath = path.join(__dirname, "core", "nomebot.json");
  fs.writeFileSync(filePath, JSON.stringify({ nome: novoNome }, null, 2));
};

const criador = "5534998769175";

const getDonos = () => {
  const filePath = path.join(__dirname, "core", "donos.json");
  if (!fs.existsSync(filePath)) return { dono2: null, dono3: null };
  return JSON.parse(fs.readFileSync(filePath));
};

const setDonos = (novosDonos) => {
  const filePath = path.join(__dirname, "core", "donos.json");
  fs.writeFileSync(filePath, JSON.stringify(novosDonos, null, 2));
};

const verificarIntegridade = () => {
  const LICENCA = "5534998769175";
  if (criador !== LICENCA) {
    console.log("Violação de integridade detectada! Encerrando o bot.");
    process.exit(1);
  }
};

exports.handleCommands = (sock) => {
  verificarIntegridade();

  sock.ev.on("messages.upsert", async ({ messages }) => {
    const msg = messages[0];
    if (!msg?.message) return;

    const text = msg.message.conversation || msg.message.extendedTextMessage?.text || "";
    const prefix = getPrefix();

    const isGroup = msg.key.remoteJid.endsWith("@g.us");
    const numero = isGroup ? msg.key.participant : msg.key.remoteJid;
    const sender = numero?.replace(/[^0-9]/g, "");
    const pushName = msg.pushName || "Usuário";
    const nomeBot = getNomeBot();

    const numerodono = sock.user.id.split(":")[0].replace(/[^0-9]/g, "");
    const { dono2, dono3 } = getDonos();

    logMensagem({ usuario: pushName, grupo: isGroup ? "Grupo" : "Privado", mensagem: text, numero });

    // ANTI-LINK
    if (isGroup) {
      const antilinkPath = path.join(__dirname, "core", "antilink.json");
      const antilinkgpPath = path.join(__dirname, "core", "antilinkgp.json");
      const antilink = fs.existsSync(antilinkPath) ? JSON.parse(fs.readFileSync(antilinkPath)) : {};
      const antilinkgp = fs.existsSync(antilinkgpPath) ? JSON.parse(fs.readFileSync(antilinkgpPath)) : {};
      const idGrupo = msg.key.remoteJid;

      const body = text.toLowerCase();
      const containsLink = body.includes("http") || body.includes(".com") || body.includes("www.");
      const isGroupLink = body.includes("chat.whatsapp.com/");

      if (antilink[idGrupo] === true && containsLink && !body.includes(numerodono)) {
        await sock.sendMessage(idGrupo, { delete: msg.key });
        await sock.groupParticipantsUpdate(idGrupo, [numero], "remove");
        await sock.sendMessage(idGrupo, { text: `Usuário @${sender} foi banido por enviar links proibidos.`, mentions: [numero] });
        return;
      }

      if (antilinkgp[idGrupo] === true && isGroupLink && !body.includes(numerodono)) {
        await sock.sendMessage(idGrupo, { delete: msg.key });
        await sock.groupParticipantsUpdate(idGrupo, [numero], "remove");
        await sock.sendMessage(idGrupo, { text: `Usuário @${sender} foi banido por divulgar grupo.`, mentions: [numero] });
        return;
      }
    }

    if (text.trim() === prefix) {
      await sock.sendMessage(msg.key.remoteJid, {
        text: `Olá @${sender}, meu prefixo é: *${prefix}*`,
        mentions: [numero],
      });
      return;
    }

    if (!text.startsWith(prefix)) return;

    const args = text.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    const commandPath = path.join(__dirname, "commands", `${commandName}.js`);

    if (fs.existsSync(commandPath)) {
      delete require.cache[require.resolve(commandPath)];
      const command = require(commandPath);
      await command.execute(sock, msg, args, {
        prefix,
        getPrefix,
        setPrefix,
        nomeBot,
        getNomeBot,
        setNomeBot,
        numerodono,
        dono2,
        dono3,
        getDonos,
        setDonos
      });
    }
  });
};
