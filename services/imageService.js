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

  static async save(file, options, ...pathSegments) {
    const fileName = `${nanoid().jpeg}`;
    const fullFilePath = path.join(process.cwd(), "public", ...pathSegments);

    await fse.ensureDir(fullFilePath);
    await Jimp.read(file, (err, file) => {
      if (err) throw err;
      file
        .resize(250, 250) // resize
        .quality(60) // set JPEG quality
        .greyscale() // set greyscale
        .write(path.join(fullFilePath, fileName)); // save

      return path.join(...pathSegments, fileName);
    });
    // public/avatars/users/<id user>/<avata>.jpeg
  }
}

module.exports = ImageService;
