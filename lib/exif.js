const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

const writeExifImg = async (media, metadata) => {
  const tempFile = path.join(__dirname, "..", "temp", `sticker_${Date.now()}.jpg`);
  fs.writeFileSync(tempFile, media);

  return new Promise((resolve, reject) => {
    const webpOutput = tempFile.replace(".jpg", ".webp");

    const convert = spawn("ffmpeg", [
      "-i", tempFile,
      "-vcodec", "libwebp",
      "-filter:v", "scale=512:512:force_original_aspect_ratio=decrease",
      "-q:v", "80",
      "-preset", "picture",
      "-loop", "0",
      "-an", "-vsync", "0",
      webpOutput
    ]);

    convert.on("close", () => {
      const data = fs.readFileSync(webpOutput);
      fs.unlinkSync(tempFile);
      fs.unlinkSync(webpOutput);
      resolve(data);
    });

    convert.on("error", err => reject(err));
  });
};

module.exports = { writeExifImg };

