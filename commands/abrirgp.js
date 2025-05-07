const moment = require("moment-timezone");

exports.execute = async (sock, m, args) => {
  const isGroup = m.key.remoteJid.endsWith("@g.us");
  if (!isGroup) return sock.sendMessage(m.key.remoteJid, { text: "Este comando só pode ser usado em grupos." });

  const horario = args[0];
  if (!horario || !/^\d{2}:\d{2}$/.test(horario)) {
    return sock.sendMessage(m.key.remoteJid, { text: "Formato inválido. Use: abrirgp 23:30" });
  }

  const [hora, minuto] = horario.split(":").map(Number);
  const agora = moment();
  const alvo = moment().hour(hora).minute(minuto).second(0);

  if (alvo.isBefore(agora)) alvo.add(1, "day"); // se horário já passou, agenda pro próximo dia

  const tempo = alvo.diff(agora);

  sock.sendMessage(m.key.remoteJid, { text: `Grupo será *aberto* às ${alvo.format("HH:mm")}.` });

  setTimeout(async () => {
    await sock.groupSettingUpdate(m.key.remoteJid, "not_announcement");
    await sock.sendMessage(m.key.remoteJid, { text: "Grupo *aberto* automaticamente." });
  }, tempo);
};

