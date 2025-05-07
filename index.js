const { verificarIntegridade } = require("./verificarIntegridade");
verificarIntegridade();

const path = require("path");
const fs = require("fs");
const {
  default: makeWASocket,
  DisconnectReason,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
} = require("@whiskeysockets/baileys");
const readline = require("readline");
const pino = require("pino");
const { handleCommands } = require("./handleCommands.js");
const { participantsUpdate } = require("./participantsUpdate.js");

const donosPath = path.join(__dirname, "assets", "donos.json");
const agendamentosPath = path.join(__dirname, "assets", "agendamentos.json");

const question = (string) => {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => rl.question(string, (ans) => {
    rl.close();
    resolve(ans);
  }));
};

function salvarNumeroConectado(userId) {
  const numero = userId.split(":")[0].replace(/[^0-9]/g, "");
  if (!numero) return;

  let dados = {};
  if (fs.existsSync(donosPath)) {
    dados = JSON.parse(fs.readFileSync(donosPath));
  }

  if (!dados.numerodono || dados.numerodono === "") {
    dados.numerodono = `+${numero}`;
    fs.writeFileSync(donosPath, JSON.stringify(dados, null, 2));
    console.log("[INFO] Dono principal definido automaticamente:", dados.numerodono);
  }
}

function restaurarAgendamentos(sock) {
  if (!fs.existsSync(agendamentosPath)) return;
  const agendamentos = JSON.parse(fs.readFileSync(agendamentosPath));

  for (const groupId in agendamentos) {
    const dados = agendamentos[groupId];
    for (const tipo of ["abrir", "fechar"]) {
      if (dados[tipo]) {
        const [h, m] = dados[tipo].split(":").map(Number);
        const agora = new Date();
        const alvo = new Date();
        alvo.setHours(h, m, 0, 0);
        if (alvo < agora) alvo.setDate(alvo.getDate() + 1);
        const delay = alvo - agora;

        setTimeout(async () => {
          const action = tipo === "abrir" ? "not_announcement" : "announcement";
          const msg = `Grupo *${tipo.toUpperCase()}DO* automaticamente pelo agendamento.`;
          try {
            await sock.groupSettingUpdate(groupId, action);
            await sock.sendMessage(groupId, { text: msg });
          } catch (err) {
            console.error(`Erro ao ${tipo} grupo ${groupId}:`, err.message);
          }
        }, delay);
      }
    }
  }
}

async function connect() {
  const { state, saveCreds } = await useMultiFileAuthState(
    path.resolve(__dirname, ".", "assets", "auth", "creds")
  );

  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    printQRInTerminal: false,
    version,
    logger: pino({ level: "silent" }),
    auth: state,
    browser: ["Ubuntu", "Chrome", "20.0.04"],
    markOnlineOnConnect: true,
  });

  if (!sock.authState.creds.registered) {
    let phoneNumber = await question("Informe o seu número de telefone: ");
    phoneNumber = phoneNumber.replace(/[^0-9]/g, "");
    if (!phoneNumber) throw new Error("Número de telefone inválido!");
    const code = await sock.requestPairingCode(phoneNumber);
    console.log(`Código de pareamento: ${code}`);
  }

  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === "close") {
      const shouldReconnect =
        lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut;
      console.log("Conexão fechada:", lastDisconnect.error, "Reconectando:", shouldReconnect);
      if (shouldReconnect) connect();
    } else if (connection === "open") {
      console.log("Bot conectado com sucesso!");
      salvarNumeroConectado(sock.user.id);
      restaurarAgendamentos(sock);
    }
  });

  sock.ev.on("creds.update", saveCreds);

  handleCommands(sock);
  participantsUpdate(sock);

  return sock;
}

connect();
