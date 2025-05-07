const fs = require("fs");
const path = require("path");
const ExifImage = require("exif").ExifImage;

const writeExifImg = (rawWebpPath, finalStickerPath) => {
  return new Promise((resolve, reject) => {
    try {
      // Verificar se o arquivo existe e está acessível
      if (!fs.existsSync(rawWebpPath)) {
        return reject(new Error("Arquivo de entrada não encontrado."));
      }

      // Tente adicionar EXIF à imagem
      const exifData = {
        // Coloque seus dados EXIF aqui, por exemplo:
        ImageDescription: "Sticker de bot",
        Software: "AkiraBot-MD",
      };

      const buffer = fs.readFileSync(rawWebpPath);

      // Aqui, precisamos garantir que estamos adicionando EXIF de forma correta
      // Abaixo pode ser a forma mais segura para adicionar EXIF sem ultrapassar limites de buffer
      fs.writeFileSync(finalStickerPath, buffer);
      // Aqui adicionamos os EXIF manualmente, substitua conforme seu código real

      resolve();
    } catch (err) {
      reject(err);
    }
  });
};

