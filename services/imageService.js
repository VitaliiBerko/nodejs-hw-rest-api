const multer = require("multer");
const { nanoid } = require("nanoid");
const Jimp = require("jimp");
const fse = require("fs-extra");
const path = require("path");
// const { error } = require("console");

class ImageService {
  static upload(name) {
    const multerStorage = multer.memoryStorage();
    const multerFilter = (req, file, cbf, res) => {
      if (file.mimetype.startsWith("image")) {
        cbf(null, true);
      } else {
        cbf(res.status(400).json({ message: `Uoload images only` }), false);
      }
    };

    return multer({
      storage: multerStorage,
      fileFilter: multerFilter,
    }).single(name);
  }

  static async save(file, ...pathSegments) {
    const fileName = `${nanoid()}.jpeg`;
    const fullFilePath = path.join(process.cwd(), "public", ...pathSegments);

    await fse.ensureDir(fullFilePath);

    const avatar = await Jimp.read(file.buffer);
    await avatar
      .resize(250, 250)
      .quality(90)
      .writeAsync(path.join(fullFilePath, fileName));

    return path.join(...pathSegments, fileName);
  }
}

module.exports = ImageService;
