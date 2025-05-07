const fs = require("fs");
const path = require("path");
const { logMensagem } = require("./core/logger");
const { exec } = require("child_process"); // Para executar comandos externos como ffmpeg

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

const criador = "+5534998769175";

const getDonos = () => {
  const filePath = path.join(__dirname, "assets", "donos.json");
  if (!fs.existsSync(filePath)) return {};
  return JSON.parse(fs.readFileSync(filePath));
};

const setDonos = (novosDonos) => {
  const filePath = path.join(__dirname, "assets", "donos.json");
  fs.writeFileSync(filePath, JSON.stringify(novosDonos, null, 2));
};

const verificarIntegridade = () => {
  const LICENCA = "+5534998769175";
  if (criador !== LICENCA) {
    console.log("Violação de integridade detectada! Encerrando o bot.");
    process.exit(1);
  }
};

const criarFigurinha = async (sock, msg, args) => {
  if (!msg.message || !msg.message.imageMessage) {
    await msg.reply("Envie uma imagem para criar uma figurinha.");
    return;
  }

  const imageMessage = msg.message.imageMessage;
  const imageBuffer = await sock.downloadMediaMessage(msg);
  
  const outputPath = path.join(__dirname, "temp", `figura_${Date.now()}.webp`);
  const command = `ffmpeg -i pipe:0 -vcodec libwebp -lossless 1 -q:v 50 -preset default -an -vsync 0 -s 512x512 -f webp ${outputPath}`;

  exec(command, { input: imageBuffer }, (error, stdout, stderr) => {
    if (error) {
      console.error("Erro ao criar figurinha:", error);
      msg.reply("Houve um erro ao criar a figurinha.");
      return;
    }

    sock.sendMessage(msg.key.remoteJid, {
      sticker: { url: outputPath },
    }).then(() => {
      fs.unlinkSync(outputPath); // Remove a figurinha após enviar
    }).catch((err) => {
      console.error("Erro ao enviar figurinha:", err);
      msg.reply("Erro ao enviar a figurinha.");
    });
  });
};

exports.handleCommands = (sock) => {
  verificarIntegridade();

  const grupoCache = {};

  sock.ev.on("messages.upsert", async ({ messages }) => {
    const msg = messages[0];
    if (!msg?.message) return;

    const m = msg;
    m.reply = (texto) => sock.sendMessage(m.chat, { text: texto }, { quoted: m });

    const text = msg.message.conversation || msg.message.extendedTextMessage?.text || "";
    const prefix = getPrefix();

    const isGroup = msg.key.remoteJid.endsWith("@g.us");
    const numero = isGroup ? msg.key.participant : msg.key.remoteJid;
    const sender = numero?.replace(/[^0-9]/g, "");
    const pushName = msg.pushName || "Usuário";
    const nomeBot = getNomeBot();
    const userId = (sock?.user?.id || "").split(":")[0].replace(/[^0-9]/g, "");
    let { dono2, dono3 } = getDonos();

    let nomeGrupo = isGroup ? grupoCache[msg.key.remoteJid] : "Privado";
    if (isGroup && !nomeGrupo) {
      try {
        const metadata = await sock.groupMetadata(msg.key.remoteJid);
        nomeGrupo = metadata.subject || "Grupo";
        grupoCache[msg.key.remoteJid] = nomeGrupo;
      } catch {
        nomeGrupo = "Grupo";
      }
    }

    const isCommand = text.startsWith(prefix);
    logMensagem({
      usuario: pushName,
      grupo: nomeGrupo,
      mensagem: text,
      numero,
      isCommand
    });

    if (text.trim() === prefix) {
      await sock.sendMessage(msg.key.remoteJid, {
        text: `Olá @${sender}, meu prefixo é: *${prefix}*`,
        mentions: [numero],
      });
      return;
    }

    if (!isCommand) return;

    const args = text.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    const commandPath = path.join(__dirname, "commands", `${commandName}.js`);

    if (fs.existsSync(commandPath)) {
      delete require.cache[require.resolve(commandPath)];
      const command = require(commandPath);

      if (["donos", "dono2", "dono3"].includes(commandName)) {
        await command.execute(m, sock, userId, {
          prefix,
          getDonos,
          setDonos
        });
      } else if (commandName === "figura") {
        await criarFigurinha(sock, m, args);
      } else {
        const groupMetadata = isGroup ? await sock.groupMetadata(msg.key.remoteJid) : {};
        await command.execute(sock, m, args, {
          prefix,
          getPrefix,
          setPrefix,
          nomeBot,
          getNomeBot,
          setNomeBot,
          numerodono: userId,
          dono2,
          dono3,
          getDonos,
          setDonos,
          isGroup,
          groupMetadata,
          participants: groupMetadata?.participants || []
        });
      }
    }
  });
};

