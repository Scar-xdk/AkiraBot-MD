exports.participantsUpdate = (sock) => {
  sock.ev.on("group-participants.update", async (update) => {
    console.log("Alteração de participantes detectada:", update);
  });
};

